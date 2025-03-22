const mongoose = require('mongoose');

const vehicleBookingSchema = new mongoose.Schema({
    BookingId: { type: String, required: true, unique: true },
    pickUpLocation: { type: String, required: true },
    date: { type: Date, required: true },
    vehicleType: { type: String, required: true },
    vehicleName: { type: String, required: true },
    price: { type: Number, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true }
});

module.exports = mongoose.model('VehicleBooking', vehicleBookingSchema);
