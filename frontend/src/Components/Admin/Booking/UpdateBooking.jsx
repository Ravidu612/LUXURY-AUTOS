import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Select, MenuItem, TextField, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicle-booking";

function UpdateBooking() {
    const { id } = useParams();
    const [booking, setBooking] = useState({
        BookingId: '',
        count: '',
        vehicleType: '',
        pickupTime: '',
        date: '',
        seatType: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const availableVehicles = ["Sedan", "SUV", "Truck", "Van"];
    const availablePickupTimes = ["09:00", "12:00", "15:00", "18:00", "21:00"];
    const currentDate = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`${URL}/${id}`);
                setBooking(response.data);
                setLoading(false);
            } catch (error) {
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
        if (!booking.count || !booking.vehicleType || !booking.pickupTime || !booking.seatType || !booking.date) {
            setError('All fields are required!');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`${URL}/${id}`, booking);
            setSuccess(true);
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/admindashboard/vehicle-booking');
            }, 2000);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
            setLoading(false);
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
                disabled
            />
            <TextField
                label="Count"
                name="count"
                value={booking.count}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                inputProps={{ min: 1 }}
            />
            <Select
                name="vehicleType"
                value={booking.vehicleType}
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
                type="date"
                name="date"
                value={booking.date ? new Date(booking.date).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputProps={{ min: currentDate }}
            />
            <Select
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
                disabled={loading}
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