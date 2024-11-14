import { BookingModel } from '../models/booking.js';
import { PetProfileModel } from '../models/pet-profile.js';

export const createBooking = async (req, res) => {
  try {
    const { 
      service, 
      petId, 
      appointmentDate, 
      appointmentTime, 
      notes, 
      price 
    } = req.body;

    // Validate pet exists and belongs to the user
    const pet = await PetProfileModel.findOne({
      _id: petId,
      petOwner: req.user.id // Assuming authenticateToken middleware adds user info
    });

    if (!pet) {
      return res.status(404).json({ 
        message: 'Pet not found or you do not have permission to book for this pet' 
      });
    }

    // Check for conflicting bookings
    const existingBooking = await BookingModel.findOne({
      service,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'This time slot is already booked' 
      });
    }

    // Create new booking
    const newBooking = new BookingModel({
      service,
      petOwner: req.user.id,
      pet: petId,
      appointmentDate,
      appointmentTime,
      notes,
      price,
      status: 'pending'
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { 
      service, 
      status, 
      startDate, 
      endDate 
    } = req.query;

    let query = { petOwner: req.user.id };

    // Add optional filters
    if (service) query.service = service;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await BookingModel.find(query)
      .populate('pet')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      data: bookings,
      message: 'Bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving bookings', 
      error: error.message 
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      appointmentDate, 
      appointmentTime, 
      notes, 
      status 
    } = req.body;

    // Find existing booking
    const existingBooking = await BookingModel.findOne({
      _id: id,
      petOwner: req.user.id
    });

    if (!existingBooking) {
      return res.status(404).json({ 
        message: 'Booking not found or you do not have permission to update' 
      });
    }

    // Check for conflicting bookings if date/time is being changed
    if (appointmentDate || appointmentTime) {
      const conflictBooking = await BookingModel.findOne({
        service: existingBooking.service,
        appointmentDate: new Date(appointmentDate || existingBooking.appointmentDate),
        appointmentTime: appointmentTime || existingBooking.appointmentTime,
        status: { $ne: 'cancelled' },
        _id: { $ne: id }
      });

      if (conflictBooking) {
        return res.status(400).json({ 
          message: 'This time slot is already booked' 
        });
      }
    }

    // Update booking
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id, 
      {
        appointmentDate: appointmentDate || existingBooking.appointmentDate,
        appointmentTime: appointmentTime || existingBooking.appointmentTime,
        notes: notes || existingBooking.notes,
        status: status || existingBooking.status
      }, 
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating booking', 
      error: error.message 
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const cancelledBooking = await BookingModel.findOneAndUpdate(
      { 
        _id: id, 
        petOwner: req.user.id 
      },
      { 
        status: 'cancelled' 
      },
      { new: true }
    );

    if (!cancelledBooking) {
      return res.status(404).json({ 
        message: 'Booking not found or you do not have permission to cancel' 
      });
    }

    res.status(200).json({
      success: true,
      data: cancelledBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error cancelling booking', 
      error: error.message 
    });
  }
};

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { 
      service, 
      date 
    } = req.query;

    if (!service || !date) {
      return res.status(400).json({ 
        message: 'Service and date are required' 
      });
    }

    // Define all possible time slots
    const allTimeSlots = [
      '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', 
      '17:00'
    ];

    // Find booked time slots for the given date and service
    const bookedSlots = await BookingModel.find({
      service,
      appointmentDate: new Date(date),
      status: { $ne: 'cancelled' }
    });

    // Extract booked times
    const bookedTimes = bookedSlots.map(booking => booking.appointmentTime);

    // Find available slots
    const availableSlots = allTimeSlots.filter(
      slot => !bookedTimes.includes(slot)
    );

    res.status(200).json({
      success: true,
      data: availableSlots,
      message: 'Available time slots retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving available time slots', 
      error: error.message 
    });
  }
};