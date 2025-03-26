const VehicleBooking = require('../Model/BookingModel'); // Adjust according to your model path
const mongoose = require('mongoose');

// Generate Vehicle Booking ID with leading zeros
const generateBookingId = async () => {
    const lastBooking = await VehicleBooking.findOne().sort({ BookingId: -1 }).limit(1);
    const lastId = lastBooking ? parseInt(lastBooking.BookingId.replace('V', ''), 10) : 0;
    const newId = `V${(lastId + 1).toString().padStart(3, '0')}`;
    return newId;
};

// Create a new Vehicle Booking
exports.createBooking = async (req, res) => {
    try {
        const { pickUpLocation, date, vehicleType, vehicleName, price, dateFrom, dateTo, count, pickupTime, seatType, userId } = req.body;

        // Generate new Booking ID
        const BookingId = await generateBookingId();

        // Check if all required fields are present
        if (!pickUpLocation || !date || !vehicleType || !vehicleName || !price || !dateFrom || !dateTo || !count || !pickupTime || !seatType || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newBooking = new VehicleBooking({
            BookingId,
            pickUpLocation,
            date,
            vehicleType,
            vehicleName,
            price,
            dateFrom,
            dateTo,
            count,
            pickupTime,
            seatType,
            userId,
        });
        await newBooking.save();

        res.status(201).json({ message: 'Booking created successfully', Booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Booking', error: error.message });
    }
};

// Get all Vehicle Booking items
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await VehicleBooking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
};

// Get a single Vehicle Booking item by ID
exports.getBookingById = async (req, res) => {
    const id = req.params.id;

    try {
        const booking = await VehicleBooking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Booking', error: error.message });
    }
};

// Update a Vehicle Booking item by ID
exports.updateBooking = async (req, res) => {
    const id = req.params.id;
    const { pickUpLocation, date, vehicleType, vehicleName, price, dateFrom, dateTo, count, pickupTime, seatType, userId } = req.body;

    try {
        const updatedBooking = await VehicleBooking.findByIdAndUpdate(
            id,
            { pickUpLocation, date, vehicleType, vehicleName, price, dateFrom, dateTo, count, pickupTime, seatType, userId },
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

// Delete a Vehicle Booking item by ID
exports.deleteBooking = async (req, res) => {
    const id = req.params.id;

    // Convert ID to ObjectId if necessary
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Booking ID' });
    }

    try {
        const deletedBooking = await VehicleBooking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Booking', error: error.message });
    }
};