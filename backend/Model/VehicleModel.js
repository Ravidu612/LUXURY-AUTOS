const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  image: { type: String },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Convertible', 'Coupe'] },
  fuel: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  seats: { type: Number, required: true, min: 1 }, // Minimum 1 seat
  transmission: { type: String, required: true, enum: ['Manual', 'Automatic'] },
  price: { type: Number, required: true, min: 0 }, // Price should be positive
  status: { type: String, required: true, enum: ['Available', 'Unavailable', 'In Maintenance'] },
});

module.exports = mongoose.model('Vehicle', VehicleSchema);