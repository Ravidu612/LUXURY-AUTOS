import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicle-booking"; // Update the endpoint if necessary

function AddBooking({ onBack }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [date, setDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [price, setPrice] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [count, setCount] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [seatType, setSeatType] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newBooking = {
        pickUpLocation: pickupLocation,
        date,
        vehicleType,
        vehicleName,
        price,
        dateFrom,
        dateTo,
        count,
        pickupTime,
        seatType,
        userId,
      };

      const response = await axios.post(URL, newBooking);
      if (response.status !== 201) {
        throw new Error('Failed to add booking. Please try again.');
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/bookings'); // Redirect to bookings page
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding booking');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Booking
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Snackbar open={success} autoHideDuration={6000}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Booking added successfully!
          </Alert>
        </Snackbar>
      )}
      <Paper sx={{ padding: 3, marginTop: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vehicle Name"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date From"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Count"
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pickup Time"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Seat Type"
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="secondary" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Booking
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default AddBooking;