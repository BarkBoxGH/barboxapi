// utils/emailTemplates.js
export const bookingCreatedTemplate = (booking) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; text-align: center; padding: 10px; }
        .content { background-color: #f4f4f4; padding: 20px; }
        .footer { text-align: center; color: #777; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
            <h2>Hello ${booking.petOwner.firstName},</h2>
            <p>Your booking has been successfully created with the following details:</p>
            <ul>
                <li><strong>Service:</strong> ${booking.service}</li>
                <li><strong>Pet Name:</strong> ${booking.petName}</li>
                <li><strong>Appointment Date:</strong> ${new Date(booking.appointmentDate).toLocaleDateString()}</li>
                <li><strong>Appointment Time:</strong> ${booking.appointmentTime}</li>
                <li><strong>Status:</strong> ${booking.status}</li>
            </ul>
            <p>Thank you for choosing our service!</p>
        </div>
        <div class="footer">
            <p>&copy; 2023 BarkBox Services. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const bookingStatusChangedTemplate = (booking) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Booking Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; text-align: center; padding: 10px; }
        .content { background-color: #f4f4f4; padding: 20px; }
        .footer { text-align: center; color: #777; margin-top: 20px; }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
        }
        .status-pending { background-color: #FFC107; color: white; }
        .status-confirmed { background-color: #4CAF50; color: white; }
        .status-cancelled { background-color: #F44336; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Status Update</h1>
        </div>
        <div class="content">
            <h2>Hello ${booking.petOwner.firstName},</h2>
            <p>The status of your booking has been updated:</p>
            <ul>
                <li><strong>Service:</strong> ${booking.service}</li>
                <li><strong>Pet Name:</strong> ${booking.petName}</li>
                <li><strong>Appointment Date:</strong> ${new Date(booking.appointmentDate).toLocaleDateString()}</li>
                <li>
                    <strong>Status:</strong> 
                    <span class="status-badge status-${booking.status.toLowerCase()}">
                        ${booking.status.toUpperCase()}
                    </span>
                </li>
            </ul>
            ${booking.notes ? `<p><strong>Additional Notes:</strong> ${booking.notes}</p>` : ''}
            <p>Thank you for your continued trust!</p>
        </div>
        <div class="footer">
            <p>&copy; 2023 BarkBox Services. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;