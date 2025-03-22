import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Select, MenuItem, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/bookings"; // Make sure this URL points to the vehicle booking API

function UpdateBooking() {
    const { id } = useParams();
    const [booking, setBooking] = useState({
        BookingId: '',
        count: '',
        vehicleId: '',
        pickupTime: '',
        date: '',
        seatType: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);  // New state for success message
    const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar for showing success/error messages
    const navigate = useNavigate();

    // Available vehicle types
    const availableVehicles = ["Sedan", "SUV", "Truck", "Van"];

    // Available pickup times
    const availablePickupTimes = ["09:00", "12:00", "15:00", "18:00", "21:00"];

    // Get current date and time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Current time in HH:mm format
    const currentDate = now.toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`${URL}/${id}`);
                setBooking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking:", error);
                setError(error.response ? error.response.data.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
    };

    const handleUpdate = async () => {
        if (!booking.count || !booking.vehicleId || !booking.pickupTime || !booking.seatType || !booking.date) {
            setError('All fields are required!');
            return;
        }

        try {
            setLoading(true);  // Start loading when the update request is sent
            await axios.put(`${URL}/${id}`, booking);
            setSuccess(true);
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/admindashboard/vehicle-booking'); // Redirect after success
            }, 2000);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
            setLoading(false);  // Stop loading in case of error
        }
    };

    if (loading && !success) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Update Vehicle Booking</Typography>
            <TextField
                label="Booking ID"
                name="BookingId"
                value={booking.BookingId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled // Booking ID shouldn't be editable
            />
            <TextField
                label="Count"
                name="count"
                value={booking.count}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number" // Set to number type to restrict input
                inputProps={{ min: 1 }} // Ensure minimum value
            />
            <Select
                label="Vehicle Type"
                name="vehicleId"
                value={booking.vehicleId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{ marginBottom: 3 }}
            >
                {availableVehicles.map(vehicle => (
                    <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                ))}
            </Select>

            <Select
                label="Pickup Time"
                name="pickupTime"
                value={booking.pickupTime}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{ marginBottom: 3 }}
            >
                {availablePickupTimes.map(time => (
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
            </Select>

            <TextField
                label="Date"
                variant="outlined"
                type="date"
                name="date"
                value={booking.date ? new Date(booking.date).toISOString().split('T')[0] : ''} // Format for the date input
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{ marginBottom: 3 }}
                inputProps={{
                    min: currentDate // Set minimum date to today
                }}
            />

            <Select
                label="Seat Type"
                name="seatType"
                value={booking.seatType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{ marginBottom: 3 }}
            >
                <MenuItem value="">Select Seat Type</MenuItem>
                <MenuItem value="luxury">Luxury</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
            </Select>

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                sx={{ marginTop: 2 }}
                disabled={loading}  // Disable the button while loading
            >
                {loading ? 'Updating...' : 'Update Booking'}
            </Button>

            {error && (
                <Typography color="error" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}

            {success && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Booking updated successfully!
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
}

export default UpdateBooking;
