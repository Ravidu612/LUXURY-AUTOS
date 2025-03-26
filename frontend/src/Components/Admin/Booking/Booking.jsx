/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddBooking from './AddBooking';

const URL = "http://localhost:4000/vehiclebookings";

function Booking() {
    const [bookings, setBookings] = useState([]);
    const [showAddBookingForm, setShowAddBookingForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(URL);
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    const handleEdit = (id) => {
        navigate(`/update-booking/${id}`);
    };

    const deleteBooking = async (id) => {
        try {
            await axios.delete(`${URL}/${id}`);
            setBookings(prev => prev.filter(booking => booking._id !== id));
        } catch (error) {
            console.error("Error deleting booking:", error.response ? error.response.data : error.message);
        }
    };

    const handleAddBooking = () => {
        setShowAddBookingForm(true);
    };

    const handleBack = () => {
        setShowAddBookingForm(false);
    };

    return (
        <Box>
            {showAddBookingForm ? (
                <AddBooking onBack={handleBack} />
            ) : (
                <>
                    <Box sx={{ marginBottom: 2 }}>
                        <Button variant="contained" color="secondary" onClick={handleAddBooking}>
                            Add Booking
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Booking ID</TableCell>
                                    <TableCell>Customer ID</TableCell>
                                    <TableCell>Vehicle ID</TableCell>
                                    <TableCell>Pick-up Location</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date From</TableCell>
                                    <TableCell>Date To</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map(booking => (
                                    <TableRow key={booking._id}>
                                        <TableCell>{booking.bookingId}</TableCell>
                                        <TableCell>{booking.customerId}</TableCell>
                                        <TableCell>{booking.vehicleId}</TableCell>
                                        <TableCell>{booking.pickUpLocation}</TableCell>
                                        <TableCell>{booking.status}</TableCell>
                                        <TableCell>{new Date(booking.dateFrom).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(booking.dateTo).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleEdit(booking._id)}>Edit</Button>
                                            <Button onClick={() => deleteBooking(booking._id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Box>
    );
}

export default Booking;
