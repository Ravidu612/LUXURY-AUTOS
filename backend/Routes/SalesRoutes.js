const express = require('express');
const router = express.Router();
const SalesController = require('./controllers/SalesController');

router.post('/sales', SalesController.createSale);
router.get('/sales', SalesController.getAllSales);
router.get('/sales/:id', SalesController.getSaleById);
router.put('/sales/:id', SalesController.updateSale);
router.delete('/sales/:id', SalesController.deleteSale);

module.exports = router;
