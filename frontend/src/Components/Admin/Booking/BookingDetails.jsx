import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  List,
} from '@mui/material';
import { Edit, Delete, Print, Add } from '@mui/icons-material';
import { BarChartOutlined } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehiclebookings";

const fetchBookings = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings().then(setBookings).catch(console.error);
  }, []);

  const handleEdit = (id) => {
    navigate(`/update-booking/${id}`);
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handlePDF = () => {
    if (bookings.length === 0) {
      alert("No bookings available for download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Vehicle Booking Report", 10, 10);
    doc.autoTable({
      head: [['Booking ID', 'Customer ID', 'Vehicle ID', 'Pick-up Location', 'Status', 'Date From', 'Date To']],
      body: bookings.map(item => [
        item.bookingId,
        item.customerId,
        item.vehicleId,
        item.pickUpLocation,
        item.status,
        new Date(item.dateFrom).toLocaleDateString(),
        new Date(item.dateTo).toLocaleDateString(),
      ]),
    });
    doc.save('booking-details.pdf');
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, newView) => newView && setViewMode(newView)}
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="bookings"><List /> Bookings</ToggleButton>
        <ToggleButton value="analysis"><BarChartOutlined /> Analysis</ToggleButton>
      </ToggleButtonGroup>

      {viewMode === 'bookings' ? (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/addbooking')}
            sx={{ marginBottom: 2 }}
          >
            Add Booking
          </Button>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
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
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.bookingId}</TableCell>
                    <TableCell>{booking.customerId}</TableCell>
                    <TableCell>{booking.vehicleId}</TableCell>
                    <TableCell>{booking.pickUpLocation}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>{new Date(booking.dateFrom).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.dateTo).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(booking._id)}><Edit /></IconButton>
                      <IconButton onClick={() => deleteBooking(booking._id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={handlePDF} sx={{ marginTop: 2 }}>
            <Print /> Download Report
          </Button>
        </>
      ) : (
        <Typography variant="h6">Analysis View Coming Soon...</Typography>
      )}
    </Box>
  );
}

export default BookingDetails;
