// validators/booking.js
import Joi from 'joi';

// Validator for creating a booking
export const createBookingValidator = Joi.object({
    // Service validation
    service: Joi.string()
        .valid('veterinary', 'grooming', 'training')
        .required()
        .messages({
            'any.only': 'Service must be one of: veterinary, grooming, training',
            'any.required': 'Service is required'
        }),

    // Pet Owner validation (assuming it's a MongoDB ObjectId)
    // petOwner: Joi.string()
    //     .required()
    //     .messages({
    //         'string.empty': 'Pet owner is required',
    //         'any.required': 'Pet owner information is mandatory'
    //     }),

    // Pet Name validation
    petName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Pet name cannot be empty',
            'string.min': 'Pet name must be at least 2 characters long',
            'string.max': 'Pet name cannot exceed 50 characters',
            'any.required': 'Pet name is required'
        }),

    // Appointment Date validation
    appointmentDate: Joi.date()
        .iso()
        .min('now')
        .required()
        .messages({
            'date.base': 'Appointment date must be a valid date',
            'date.min': 'Appointment date must be in the present or future',
            'any.required': 'Appointment date is required'
        }),

    // Appointment Time validation
    appointmentTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
            'string.pattern.base': 'Appointment time must be in HH:MM format (24-hour)',
            'any.required': 'Appointment time is required'
        }),

    // Optional notes
    notes: Joi.string()
        .trim()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Notes cannot exceed 500 characters'
        }),

    // Status validation (optional during creation, will default to 'pending')
    status: Joi.string()
        .valid('pending', 'confirmed', 'completed', 'cancelled')
        .optional()
        .default('pending')
        .messages({
            'any.only': 'Invalid booking status'
        })
});

// Validator for updating a booking
export const updateBookingValidator = Joi.object({
    // Service validation (optional during update)
    service: Joi.string()
        .valid('veterinary', 'grooming', 'training')
        .optional()
        .messages({
            'any.only': 'Service must be one of: veterinary, grooming, training'
        }),

    // Pet Owner validation (optional during update)
    petOwner: Joi.string()
        .optional(),

    // Pet Name validation (optional during update)
    petName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Pet name must be at least 2 characters long',
            'string.max': 'Pet name cannot exceed 50 characters'
        }),

    // Appointment Date validation (optional during update)
    appointmentDate: Joi.date()
        .iso()
        .min('now')
        .optional()
        .messages({
            'date.base': 'Appointment date must be a valid date',
            'date.min': 'Appointment date must be in the present or future'
        }),

    // Appointment Time validation (optional during update)
    appointmentTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
            'string.pattern.base': 'Appointment time must be in HH:MM format (24-hour)'
        }),

    // Optional notes
    notes: Joi.string()
        .trim()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Notes cannot exceed 500 characters'
        }),

    // Status validation (optional during update)
    status: Joi.string()
        .valid('pending', 'confirmed', 'completed', 'cancelled')
        .optional()
        .messages({
            'any.only': 'Invalid booking status'
        })
});

// Validation function for creating a booking
export const validateCreateBooking = (data) => {
    return createBookingValidator.validate(data, { abortEarly: false });
};

// Validation function for updating a booking
export const validateUpdateBooking = (data) => {
    return updateBookingValidator.validate(data, { abortEarly: false });
};

// Additional helper function to extract validation errors
export const extractValidationErrors = (validationResult) => {
    if (validationResult.error) {
        return validationResult.error.details.map(error => ({
            field: error.path[0],
            message: error.message
        }));
    }
    return [];
};