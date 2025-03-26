import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from "@mui/material";

const BookingDetails = () => {
  const [bookings, setBookings] = useState([
    {
      bookingId: "B001",
      customerId: "C123",
      vehicleId: "V456",
      pickUpLocation: "New York",
      status: "Confirmed",
      dateFrom: "2025-04-01",
      dateTo: "2025-04-05",
    },
    {
      bookingId: "B002",
      customerId: "C789",
      vehicleId: "V654",
      pickUpLocation: "Los Angeles",
      status: "Pending",
      dateFrom: "2025-04-10",
      dateTo: "2025-04-15",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    bookingId: "",
    customerId: "",
    vehicleId: "",
    pickUpLocation: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleOpenDialog = (booking = null) => {
    setCurrentBooking(booking || {
      bookingId: `B00${bookings.length + 1}`,
      customerId: "",
      vehicleId: "",
      pickUpLocation: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBooking(null);
  };

  const handleOpenDeleteDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenDeleteDialog(true);
  };

  const handleDeleteBooking = () => {
    setBookings(bookings.filter((b) => b.bookingId !== currentBooking.bookingId));
    setOpenDeleteDialog(false);
  };

  const handleSaveBooking = () => {
    setBookings((prev) => {
      const exists = prev.find((b) => b.bookingId === currentBooking.bookingId);
      return exists ? prev.map((b) => (b.bookingId === currentBooking.bookingId ? currentBooking : b)) : [...prev, currentBooking];
    });
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setCurrentBooking({ ...currentBooking, [e.target.name]: e.target.value });
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.customerId.includes(searchQuery) || booking.vehicleId.includes(searchQuery)) &&
    (filterStatus === "" || booking.status === filterStatus) &&
    (filterDateFrom === "" || new Date(booking.dateFrom) >= new Date(filterDateFrom)) &&
    (filterDateTo === "" || new Date(booking.dateTo) <= new Date(filterDateTo))
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
      <div className="flex gap-4 mb-4">
        <TextField
          label="Search by Customer ID or Vehicle ID"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} displayEmpty>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
        />
        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
        />
      
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>Add Booking</Button>
      </div><br></br>
      <TableContainer component={Paper} className="mt-4">
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
            {filteredBookings.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.customerId}</TableCell>
                <TableCell>{booking.vehicleId}</TableCell>
                <TableCell>{booking.pickUpLocation}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>{booking.dateFrom}</TableCell>
                <TableCell>{booking.dateTo}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpenDialog(booking)}>Edit</Button>
                  <Button color="secondary" onClick={() => handleOpenDeleteDialog(booking)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookingDetails;
