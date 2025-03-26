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
  const [bookingId, setBookingId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newBooking = {
        BookingId: bookingId,
        customerId,
        vehicleId,
        pickUpLocation,
        status,
        dateFrom,
        dateTo,
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
                id="booking-id" // Added id
                label="Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="customer-id" // Added id
                label="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="vehicle-id" // Added id
                label="Vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="pickup-location" // Added id
                label="Pickup Location"
                value={pickUpLocation}
                onChange={(e) => setPickUpLocation(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="status" // Added id
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="date-from" // Added id
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
                id="date-to" // Added id
                label="Date To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
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