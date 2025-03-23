const express = require('express');
const router = express.Router();
const VehicleController = require('../Controllers/VehicleController');
const upload = require('../middleware/multer');

// Routes
// Create vehicle route (image as URL, no file upload needed)
router.post('/', VehicleController.createVehicle);

// Get all vehicles
router.get('/', VehicleController.getAllVehicles);

// Get a single vehicle by ID
router.get('/:id', VehicleController.getVehicleById);

// Update vehicle route (file upload for image)
router.put('/:id', upload.single('image'), VehicleController.updateVehicle);

// Delete vehicle by ID
router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router;
