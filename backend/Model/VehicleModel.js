const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  VID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fuel: { type: String, required: true },
  seating: { type: Number, required: true },
  transmission: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  image: { type: String }, // Image URL or path
  description: { type: String }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
