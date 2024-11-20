// controllers/booking.js
import { BookingModel } from "../models/booking.js";
import { sendMail } from "../utils/mail.js";
import { bookingCreatedTemplate,
  bookingStatusChangedTemplate
 } from "../utils/emailTemplates.js";
import { UserModel } from "../models/user.js";
import { 
    validateCreateBooking, 
    validateUpdateBooking, 
    extractValidationErrors 
} from "../validators/booking.js";

// Create a new booking
export const createBooking = async (req, res, next) => {
    try {
        // Validate incoming booking data
        const validationResult = validateCreateBooking(req.body);
        
        // Check for validation errors
        if (validationResult.error) {
            return res.status(400).json({
                success: false,
                errors: extractValidationErrors(validationResult)
            });
        }

        const { service, petName, appointmentDate, appointmentTime, notes = '' } = req.body;

          // Verify that the petOwner exists
          const ownerExists = await UserModel.findById(req.user.id);
          if (!ownerExists) {
              return res.status(404).json({
                  success: false,
                  message: "Pet owner not found"
              });
          }

        // Check for existing bookings at the same date and time
        const bookingDate = new Date(appointmentDate);
        const existingBooking = await BookingModel.findOne({
            service,
            appointmentDate: {
                $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
                $lt: new Date(bookingDate.setHours(23, 59, 59, 999))
            },
            appointmentTime
        });

        if (existingBooking) {
            return res.status(409).json({ 
                success: false,
                message: "This time slot is already booked. Please choose another time." 
            });
        }

        // Create new booking
        const newBooking = new BookingModel({
          service,
          petOwner: req.user.id,
          petName,
          appointmentDate,
          appointmentTime,
          notes, // Optional notes
          status: 'pending'
      });

        // save booking
        await newBooking.save();

         // Populate petOwner details for the response
        await newBooking.populate('petOwner', 'firstName lastName email');
      
        try {
          await sendMail({
              to: newBooking.petOwner.email,
              subject: 'Booking Confirmation - BarkBox Services',
              html: bookingCreatedTemplate(newBooking)
          });
      } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Note: We don't stop the booking process if email fails
      }

        res.status(201).json({
            success: true,
            data: newBooking,
            message: "Booking created successfully"
        });

    } catch (error) {
        next(error);
    }
};

// Get all bookings with advanced filtering and pagination
export const getAllBookings = async (req, res, next) => {
    try {
        const { 
            service, 
            status, 
            petOwner,
            startDate,
            endDate,
            page = 1, 
            limit = 10, 
            sort = '-appointmentDate' 
        } = req.query;

        // Create dynamic query
        let query = {};

        // Add filters
        if (service) query.service = service;
        if (status) query.status = status;
        if (petOwner) query.petOwner = petOwner;

        // Date range filter
        if (startDate || endDate) {
            query.appointmentDate = {};
            if (startDate) query.appointmentDate.$gte = new Date(startDate);
            if (endDate) query.appointmentDate.$lte = new Date(endDate);
        }

        // Pagination and sorting
        const skip = (page - 1) * limit;
        const bookings = await BookingModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('petOwner', 'firstName lastName email');

        const total = await BookingModel.countDocuments(query);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        next(error);
    }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
    try {
        const booking = await BookingModel.findById(req.params.id)
            .populate('petOwner', 'firstName lastName email');

        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: "Booking not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        next(error);
    }
};

// Update booking
export const updateBooking = async (req, res, next) => {
    try {
        // Validate incoming update data
        const validationResult = validateUpdateBooking(req.body);
        
        // Check for validation errors
        if (validationResult.error) {
            return res.status(400).json({
                success: false,
                errors: extractValidationErrors(validationResult)
            });
        }

        const { service, appointmentDate, appointmentTime } = req.body;

        // If date or time is being changed, check for conflicts
        if (appointmentDate || appointmentTime) {
            const bookingToUpdate = await BookingModel.findById(req.params.id);
            
            if (!bookingToUpdate) {
                return res.status(404).json({ 
                    success: false,
                    message: "Booking not found" 
                });
            }

            const checkDate = new Date(appointmentDate || bookingToUpdate.appointmentDate);
            const checkService = service || bookingToUpdate.service;
            const checkTime = appointmentTime || bookingToUpdate.appointmentTime;

            const existingBooking = await BookingModel.findOne({
                _id: { $ne: req.params.id }, // Exclude current booking
                service: checkService,
                appointmentDate: {
                    $gte: new Date(checkDate.setHours(0, 0, 0, 0)),
                    $lt: new Date(checkDate.setHours(23, 59, 59, 999))
                },
                appointmentTime: checkTime
            });

            if (existingBooking) {
                return res.status(409).json({ 
                    success: false,
                    message: "This time slot is already booked. Please choose another time." 
                });
            }
        }

        // Update booking
        const updatedBooking = await BookingModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updatedBooking) {
            return res.status(404).json({ 
                success: false,
                message: "Booking not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: updatedBooking,
            message: "Booking updated successfully"
        });

    } catch (error) {
        next(error);
    }
};

// Update booking status
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate status
        const validationResult = validateUpdateBooking({ status });
        
        if (validationResult.error) {
            return res.status(400).json({
                success: false,
                errors: extractValidationErrors(validationResult)
            });
        }

        const updatedBooking = await BookingModel.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { 
                new: true,
                runValidators: true 
            }
        ).populate('petOwner', 'firstName lastName email');

        if (!updatedBooking) {
            return res.status(404).json({ 
                success: false,
                message: "Booking not found" 
            });
        }

      // Send status change email
      try {
        await sendMail({
            to: updatedBooking.petOwner.email,
            subject: `Booking Status Update - ${status.toUpperCase()}`,
            html: bookingStatusChangedTemplate(updatedBooking)
        });
    } catch (emailError) {
        console.error('Status change email sending failed:', emailError);
        // Note: We don't stop the status update if email fails
    }

        res.status(200).json({
            success: true,
            data: updatedBooking,
            message: "Booking status updated successfully"
        });

    } catch (error) {
        next(error);
    }
};

// Delete a booking
export const deleteBooking = async (req, res, next) => {
  try {
      // First, find the booking to check its status before deletion
      const booking = await BookingModel.findById(req.params.id);

      // Check if booking exists
      if (!booking) {
          return res.status(404).json({ 
              success: false,
              message: "Booking not found" 
          });
      }

      // Optional: Prevent deletion of certain booking statuses
      if (booking.status === 'confirmed') {
          return res.status(400).json({
              success: false,
              message: "Cannot delete a confirmed booking"
          });
      }
      
      // Proceed with deletion
      const deletedBooking = await BookingModel.findByIdAndDelete(req.params.id);

      res.status(200).json({
          success: true,
          data: deletedBooking,
          message: "Booking deleted successfully"
      });

  } catch (error) {
      // Log the error for debugging
      console.error('Booking deletion error:', error);
      next(error);
  }
};

// get all bookings for a specific pet owner or user
export const getBookingsByUser = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Get pagination parameters from query
        const skip = (page - 1) * limit;
        
        const bookings = await BookingModel.find({ petOwner: req.params.id })
            .populate('petOwner', 'firstName lastName email')
            .populate('service', 'name')
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await BookingModel.countDocuments({ petOwner: req.params.id });
        
        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// get all bookings for a specific service
export const getBookingsByService = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const bookings = await BookingModel.find({ service: req.params.id })
            .populate('petOwner', 'firstName lastName email')
            .populate('service', 'name')
            .skip(skip)
            .limit(parseInt(limit))
            .sort('-appointmentDate');

        const total = await BookingModel.countDocuments({ service: req.params.id });

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// get all bookings for a specific date
export const getBookingsByDate = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const { date } = req.params; // date is in the format YYYY-MM-DD (e.g., 2023-09-25)
        const bookings = await BookingModel.find({ appointmentDate: date}) // filter booking by date
        .populate('petOwner', 'firstName lastName email')
        .populate('service', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-appointmentDate');
        // count total bookings for the date
        const total = await BookingModel.countDocuments({ appointmentDate: date});
        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        
        });
        } catch (error) {
            next(error);
        }}