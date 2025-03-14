const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    BookingId: { type: String, required: true, unique: true },
    TicketId: { type: String, required: true },
    count: { type: Number, required: true },
    movieId: { type: String, required: true },
    userId: { type: String, required: true },
    showTimeId: { type: String },
    date: { type: Date, required: true },
    seat: { type: String, required: true }
});


module.exports = mongoose.model('Booking', bookingSchema);
