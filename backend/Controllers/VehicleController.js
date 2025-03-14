const Vehicle = require('../Model/VehicleModel');

// Genefuel Vehicle ID with leading zeros
const genefuelVehicleId = async () => {
    const lastVehicle = await Vehicle.findOne().sort({ VID: -1 }).limit(1);
    const lastId = lastVehicle ? parseInt(lastVehicle.VID.replace('V', ''), 10) : 0;
    const newId = `V${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new Vehicle item
exports.createVehicle = async (req, res) => {
    try {
        const {image, name, fuel, seating, transmission,price,status  } = req.body;
        const VID = await genefuelVehicleId(); // Genefuel new Vehicle ID
        const newVehicle = new Vehicle({ VID,  name, fuel, seating, transmission,price,status  });
        await newVehicle.save();

        res.status(201).json({ message: 'Vehicle created successfully', Vehicle: newVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Vehicle', error });
    }
};

// Get all Vehicle items
exports.getAllVehicle = async (req, res) => {
    try {
        const Vehicles = await Vehicle.find();
        res.status(200).json(Vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Vehicle', error });
    }
};

// Get a single Vehicle item by ID
exports.getVehicleById = async (req, res) => {
    const id = req.params.id;

    try {
        const Vehicle = await Vehicle.findById(id);
        if (!Vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(Vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Vehicle', error });
    }
};

// Update a Vehicle item by ID
exports.updateVehicle = async (req, res) => {
    const id = req.params.id;
    const { name, fuel, seating, transmission,price,status  } = req.body;

    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            id,
            {  name, fuel, seating, transmission,price,status  },
            { new: true } // Return the updated Vehicle
        );

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle updated successfully', Vehicle: updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Vehicle', error });
    }
};

// Delete a Vehicle item by ID
exports.deleteVehicle = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Vehicle', error });
    }
};
