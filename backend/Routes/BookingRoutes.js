const express = require('express');
const router = express.Router();
const BookingController = require('../Controllers/BookingController');

// Route to create a new booking
router.post('/vehicle-booking', BookingController.createBooking);

// Route to get all bookings
router.get('/vehicle-booking', BookingController.getAllBookings);

// Route to get a booking by ID
router.get('/vehicle-booking/:id', BookingController.getBookingById);

// Route to update a booking by ID
router.put('/vehicle-booking/:id', BookingController.updateBooking);

// Route to delete a booking by ID
router.delete('/vehicle-booking/:id', BookingController.deleteBooking);

module.exports = router;