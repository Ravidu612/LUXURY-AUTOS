const mongoose = require('mongoose');

const vehicleBookingSchema = new mongoose.Schema({
    BookingId: { type: String, required: true, unique: true },
    pickUpLocation: { type: String, required: true },
    date: { type: Date, required: true },
    vehicleType: { type: String, required: true },
    vehicleName: { type: String, required: true },
    price: { type: Number, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    count: { type: Number, required: true }, // Added count field
    pickupTime: { type: String, required: true }, // Added pickupTime field
    seatType: { type: String, required: true }, // Added seatType field
    userId: { type: String, required: true } // Added userId field
});

module.exports = mongoose.model('VehicleBooking', vehicleBookingSchema);