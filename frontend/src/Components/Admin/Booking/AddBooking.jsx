/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicle-booking";

function AddBooking({ onBack }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [date, setDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [price, setPrice] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Date range validation: dateFrom should be before dateTo
    if (new Date(dateFrom) >= new Date(dateTo)) {
      setError('Date From must be earlier than Date To');
      return;
    }

    try {
      const response = await axios.post(URL, {
        pickupLocation,
        date,
        vehicleType,
        vehicleName,
        price: Number(price),
        dateFrom,
        dateTo
      });

      if (response.status === 201) {
        alert('Vehicle booking added successfully');
        navigate('/admindashboard/vehicle-booking-management');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Add New Vehicle Booking
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Pick-up Location"
          variant="outlined"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Booking Date"
          variant="outlined"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Vehicle Type"
          variant="outlined"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Vehicle Name"
          variant="outlined"
          value={vehicleName}
          onChange={(e) => setVehicleName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Price"
          variant="outlined"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Date From"
          variant="outlined"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Date To"
          variant="outlined"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Add Booking
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 2, marginLeft: 2 }}
          onClick={onBack}
        >
          Back
        </Button>
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default AddBooking;