// routes/booking.js
import { Router } from 'express';
import { 
    createBooking, 
    getAllBookings, 
    getBookingById, 
    updateBooking, 
    updateBookingStatus, 
    deleteBooking 
} from '../controllers/booking.js';
import { authenticateToken } from '../middlewares/authenticator.js';
import { authorizeRoles } from '../middlewares/authorization.js';

export const bookingRouter = Router();

// Create a new booking (accessible to authenticated users)
bookingRouter.post('/book', 
    authenticateToken, 
    createBooking
);

// Get all bookings (with filtering and pagination)
// Restrict to admin and vendor roles
bookingRouter.get('/all', 
    authenticateToken, 
    authorizeRoles(['admin', 'vendor']), 
    getAllBookings
);

// Get a specific booking by ID
// Users can only access their own bookings, admins can access all
bookingRouter.get('/mybooking/:id', 
    authenticateToken, 
    getBookingById
);

// Update a booking (full update)
bookingRouter.put('/mybooking/:id', 
    authenticateToken, 
    updateBooking
);

// Partial update of booking status (for admins/vendors)
bookingRouter.patch('/:id/status', 
    authenticateToken, 
    authorizeRoles(['admin', 'vendor']), 
    updateBookingStatus
);

// Delete a booking
bookingRouter.delete('/:id', 
    authenticateToken, 
    deleteBooking
);

