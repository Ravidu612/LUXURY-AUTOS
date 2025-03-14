const express = require('express');
const router = express.Router();
const VehicleController = require('../Controllers/VehicleController');
const upload = require('../middleware/multer');

// Routes
router.post('/', upload.single('image'), VehicleController.createVehicle);
router.get('/', VehicleController.getAllVehicle);
router.get('/:id', VehicleController.getVehicleById);
router.put('/:id', upload.single('image'), VehicleController.updateVehicle);
router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router;
