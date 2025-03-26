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
  Typography,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicle-booking";

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      setBookings(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-booking/${id}`);
  };

  const deleteBooking = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this booking?');
    if (confirmed) {
      try {
        await axios.delete(`${URL}/${id}`);
        loadBookings();
        alert("Booking deleted successfully");
      } catch (error) {
        console.error("Error deleting booking:", error.response ? error.response.data : error.message);
      }
    }
  };

  const handlePDF = () => {
    if (bookings.length === 0) {
      alert("No bookings available for download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Vehicle Booking Details", 10, 10);

    doc.autoTable({
      head: [['Booking ID', 'Pickup Location', 'Vehicle Type', 'Vehicle Name', 'Price', 'Date From', 'Date To']],
      body: bookings.map(item => [
        item.BookingId,
        item.pickUpLocation,
        item.vehicleType,
        item.vehicleName,
        item.price,
        new Date(item.dateFrom).toLocaleDateString(),
        new Date(item.dateTo).toLocaleDateString(),
      ]),
      startY: 20,
    });

    doc.save('vehicle-booking-details.pdf');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/admindashboard/add-booking')}>
          + Add Booking
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Pickup Location</TableCell>
                <TableCell>Vehicle Type</TableCell>
                <TableCell>Vehicle Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date From</TableCell>
                <TableCell>Date To</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .filter((item) =>
                  item.BookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.pickUpLocation.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <TableRow key={item.BookingId}>
                    <TableCell>{item.BookingId}</TableCell>
                    <TableCell>{item.pickUpLocation}</TableCell>
                    <TableCell>{item.vehicleType}</TableCell>
                    <TableCell>{item.vehicleName}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{new Date(item.dateFrom).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(item.dateTo).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(item._id)} sx={{ color: 'primary.main' }}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteBooking(item._id)} sx={{ color: 'error.main' }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handlePDF}
        sx={{ marginTop: 2 }}
        startIcon={<Print />}
      >
        Download
      </Button>
    </Box>
  );
}

export default BookingDetails;