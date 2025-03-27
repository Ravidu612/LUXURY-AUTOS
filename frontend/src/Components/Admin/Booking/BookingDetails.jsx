import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";

const BookingDetails = () => {
  const [bookings, setBookings] = useState([
    { bookingId: "B001", customerId: "C123", vehicleId: "V456", pickUpLocation: "New York", status: "Confirmed", dateFrom: "2025-04-01", dateTo: "2025-04-05" },
    { bookingId: "B002", customerId: "C789", vehicleId: "V654", pickUpLocation: "Los Angeles", status: "Pending", dateFrom: "2025-04-10", dateTo: "2025-04-15" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const handleOpenDialog = (booking = null) => {
    setCurrentBooking(booking || { bookingId: `B00${bookings.length + 1}`, customerId: "", vehicleId: "", pickUpLocation: "", status: "", dateFrom: "", dateTo: "" });
    setOpenDialog(true);
  };

  const handleSaveBooking = () => {
    setBookings((prev) => {
      const exists = prev.find((b) => b.bookingId === currentBooking.bookingId);
      return exists ? prev.map((b) => (b.bookingId === currentBooking.bookingId ? currentBooking : b)) : [...prev, currentBooking];
    });
    setOpenDialog(false);
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (booking.customerId.toLowerCase().includes(searchLower) || booking.vehicleId.toLowerCase().includes(searchLower)) &&
           (filterStatus === "" || booking.status === filterStatus);
  });

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>🚗 Booking Management</Typography>

      {/* Filters & Search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <TextField
          label="Search Customer/Vehicle"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
          style={{ flex: "1" }}
        />
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} displayEmpty variant="outlined" style={{ minWidth: "150px" }}>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
          <MenuItem value="Pending">⏳ Pending</MenuItem>
        </Select>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add Booking</Button>
      </div>

      {/* Booking Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#eeeeee" }}>
              <TableCell><b>Booking ID</b></TableCell>
              <TableCell><b>Customer ID</b></TableCell>
              <TableCell><b>Vehicle ID</b></TableCell>
              <TableCell><b>Pick-up Location</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Date From</b></TableCell>
              <TableCell><b>Date To</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.bookingId} hover>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.customerId}</TableCell>
                <TableCell>{booking.vehicleId}</TableCell>
                <TableCell>{booking.pickUpLocation}</TableCell>
                <TableCell>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: booking.status === "Confirmed" ? "#4caf50" : "#ff9800",
                    color: "white",
                  }}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>{booking.dateFrom}</TableCell>
                <TableCell>{booking.dateTo}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(booking)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => setBookings(bookings.filter((b) => b.bookingId !== booking.bookingId))}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentBooking?.bookingId ? "✏️ Edit Booking" : "➕ Add Booking"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Customer ID" value={currentBooking?.customerId || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, customerId: e.target.value })} />
          <TextField fullWidth margin="dense" label="Vehicle ID" value={currentBooking?.vehicleId || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, vehicleId: e.target.value })} />
          <TextField fullWidth margin="dense" label="Pick-up Location" value={currentBooking?.pickUpLocation || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, pickUpLocation: e.target.value })} />
          <Select fullWidth value={currentBooking?.status || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, status: e.target.value })}>
            <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="Pending">⏳ Pending</MenuItem>
          </Select>
          <TextField fullWidth margin="dense" label="Date From" type="date" InputLabelProps={{ shrink: true }} value={currentBooking?.dateFrom || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, dateFrom: e.target.value })} />
          <TextField fullWidth margin="dense" label="Date To" type="date" InputLabelProps={{ shrink: true }} value={currentBooking?.dateTo || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, dateTo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveBooking}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingDetails;
