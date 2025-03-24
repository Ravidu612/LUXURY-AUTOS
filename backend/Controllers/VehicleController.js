const Vehicle = require('../Model/vehicleModel');

// Generate Vehicle ID with leading zeros
const generateVehicleId = async () => {
    const lastVehicle = await Vehicle.findOne().sort({ vehicleId: -1 }).limit(1);
    const lastId = lastVehicle ? parseInt(lastVehicle.vehicleId.replace('V', ''), 10) : 0;
    const newId = `V${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { image, name, type, fuel, seats, transmission, price, status, ownerID } = req.body;

        // Check if all required fields are provided
        if (!name || !type || !fuel || !seats || !transmission || !price || !status || !ownerID) {
            return res.status(400).json({ message: 'All fields except image are required' });
        }

        // If image is provided, validate that it's a URL (simple validation)
        if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/.test(image)) {
            return res.status(400).json({ message: 'Invalid image URL' });
        }

        // Generate a new Vehicle ID
        const vehicleId = await generateVehicleId();

        // Create a new vehicle document
        const newVehicle = new Vehicle({
            vehicleId,
            image, // Image URL will be stored
            name,
            type,
            fuel,
            seats,
            transmission,
            price,
            status,
            ownerID,
        });

        // Save the new vehicle to the database
        await newVehicle.save();

        // Send success response
        res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: 'Error creating vehicle', error });
    }
};


// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vehicles', error });
    }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vehicle', error });
    }
};

// Update vehicle by ID
exports.updateVehicle = async (req, res) => {
    try {
        const { image, name, type, fuel, seats, transmission, price, status, ownerID } = req.body;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { image, name, type, fuel, seats, transmission, price, status, ownerID },
            { new: true } // Return the updated Vehicle
        );

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error updating vehicle', error });
    }
};

// Delete vehicle by ID
exports.deleteVehicle = async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error });
    }
};
