const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    rentalPeriod: { type: Number, required: true }, // Number of days rented
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);
