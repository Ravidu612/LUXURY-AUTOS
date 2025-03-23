const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  image: { type: String }, // Image URL or path
  name: { type: String, required: true },
  type: { type: String, required: true },
  fuel: { type: String, required: true },
  seats: { type: Number, required: true },
  transmission: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  ownerID: { type: String, required: true }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
