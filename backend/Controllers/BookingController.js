const Booking = require('../Model/BookingModel');

// Generate Booking ID with leading zeros
const generateBookingId = async () => {
    const lastBooking = await Booking.findOne().sort({ BookingId: -1 }).limit(1);
    const lastId = lastBooking ? parseInt(lastBooking.BookingId.replace('B', ''), 10) : 0;
    const newId = `B${(lastId + 1).toString().padStart(3, '0')}`;
    return newId;
};

// Create a new Booking item
exports.createBooking = async (req, res) => {
    try {
        const { TicketId, count, movieId, userId, showTimeId, date, seat } = req.body;
        
        // Generate new Booking ID
        const BookingId = await generateBookingId();
        
        // Check if all required fields are present
        if (!TicketId || !count || !movieId || !userId || !date || !seat) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newBooking = new Booking({ BookingId, TicketId, count, movieId, userId, showTimeId, date, seat });
        await newBooking.save();

        res.status(201).json({ message: 'Booking created successfully', Booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Booking', error: error.message });
    }
};

// Get all Booking items
exports.getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
};

// Get a single Booking item by ID
exports.getBookingById = async (req, res) => {
    const id = req.params.id;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Booking', error: error.message });
    }
};

// Update a Booking item by ID
exports.updateBooking = async (req, res) => {
    const id = req.params.id;
    const { TicketId, count, movieId, userId, showTimeId, date, seat } = req.body;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { TicketId, count, movieId, userId, showTimeId, date, seat },
            { new: true, runValidators: true } // Return the updated Booking, validate inputs
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', Booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Booking', error: error.message });
    }
};

// Delete a Booking item by ID
const mongoose = require('mongoose');

exports.deleteBooking = async (req, res) => {
    const id = req.params.id;

    // Convert ID to ObjectId if necessary
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Booking ID' });
    }

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Booking', error: error.message });
    }
};

