const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/BookingController');

// Booking routes
router.post('/', bookingController.createBooking); // Create a new booking
router.get('/', bookingController.getAllBooking); // Get all bookings
router.get('/:id', bookingController.getBookingById); // Get booking by ID
router.put('/:id', bookingController.updateBooking); // Update booking by ID
router.delete('/:id', bookingController.deleteBooking); // Delete booking by ID

module.exports = router;
