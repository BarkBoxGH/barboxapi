// middlewares/authorization.js
export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Insufficient permissions' 
            });
        }

        next();
    };
};

// Optional: Role-based access control for specific resources
export const canAccessBooking = async (req, res, next) => {
    try {
        const booking = await BookingModel.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }

        // Admin can access all bookings
        if (req.user.role === 'admin') {
            return next();
        }

        // User can only access their own bookings
        if (req.user.role === 'user' && 
            booking.petOwner.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'You are not authorized to access this booking' 
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};