const Sale = require('../models/Sale');

// Create a new sale
exports.createSale = async (req, res) => {
    try {
        const { vehicleId, customerId, rentalPeriod, totalAmount, paymentStatus } = req.body;

        if (!vehicleId || !customerId || !rentalPeriod || !totalAmount || !paymentStatus) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newSale = new Sale({ vehicleId, customerId, rentalPeriod, totalAmount, paymentStatus });
        await newSale.save();

        res.status(201).json({ message: 'Sale recorded successfully', sale: newSale });
    } catch (error) {
        res.status(500).json({ message: 'Error creating sale', error });
    }
};

// Get all sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate('vehicleId customerId');
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sales', error });
    }
};

// Get a sale by ID
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('vehicleId customerId');
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sale', error });
    }
};

// Update sale details (e.g., payment status)
exports.updateSale = async (req, res) => {
    try {
        const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json({ message: 'Sale updated successfully', sale: updatedSale });
    } catch (error) {
        res.status(500).json({ message: 'Error updating sale', error });
    }
};

// Delete a sale record
exports.deleteSale = async (req, res) => {
    try {
        const deletedSale = await Sale.findByIdAndDelete(req.params.id);
        if (!deletedSale) return res.status(404).json({ message: 'Sale not found' });

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sale', error });
    }
};
