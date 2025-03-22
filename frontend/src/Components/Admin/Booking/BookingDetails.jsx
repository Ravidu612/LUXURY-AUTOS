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
  CircularProgress,
  List
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/vehicle-bookings";

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
  const [originalBookings, setOriginalBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [viewMode, setViewMode] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchBookings();
      setBookings(data);
      setOriginalBookings(data);
      setNoResults(data.length === 0);
      setError(null);
    } catch (error) {
      setError('Failed to load bookings.');
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setBookings(originalBookings);
    } else {
      const filteredBookings = originalBookings.filter(item =>
        Object.values(item).some(field =>
          field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setBookings(filteredBookings);
      setNoResults(filteredBookings.length === 0);
    }
  }, [searchQuery, originalBookings]);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-booking/${id}`);
  };

  const deleteBooking = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this booking?');
    if (confirmed) {
      try {
        const response = await axios.delete(`${URL}/${id}`);
        if (response.status === 200) {
          loadBookings();
          alert("Booking deleted successfully");
        }
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
    doc.setFontSize(12);
    doc.text("Booking Details Report", 10, 20);

    doc.autoTable({
      head: [['Booking ID', 'Pickup Location', 'Vehicle Type', 'Vehicle Name', 'Price', 'Date From', 'Date To']],
      body: bookings.map(item => [
        item.BookingId,
        item.pickupLocation,
        item.vehicleType,
        item.vehicleName,
        item.price,
        new Date(item.dateFrom).toLocaleDateString(),
        new Date(item.dateTo).toLocaleDateString(),
      ]),
      startY: 30,
      margin: { top: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    });

    doc.save('vehicle-booking-details.pdf');
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="View Mode"
          sx={{ marginBottom: 2 }}
        >
          <ToggleButton value="bookings" aria-label="Booking List">
            <List /> Bookings
          </ToggleButton>
        </ToggleButtonGroup>
        <Button variant="contained" color="primary" onClick={() => navigate('/admindashboard/add-booking')}>
          Add Booking
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexShrink: 1, width: '200px', backgroundColor: 'white', borderRadius: 1 }}
            />
          </Box>

          <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
            <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
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
                  {noResults ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">No booking found.</TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((item) => (
                      <TableRow key={item.BookingId}>
                        <TableCell>{item.BookingId}</TableCell>
                        <TableCell>{item.pickupLocation}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Button variant="contained" color="primary" onClick={handlePDF} sx={{ marginTop: 2 }}>
              <Print /> Download
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default BookingDetails;
