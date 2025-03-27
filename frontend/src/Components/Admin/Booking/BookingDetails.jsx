import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Download, Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BookingDetails = () => {
  const [bookings, setBookings] = useState([
    { bookingId: "B001", customerId: "C123", vehicleId: "V456", pickUpLocation: "Colombo", status: "Confirmed", dateFrom: "2025-04-01", dateTo: "2025-04-05" },
    { bookingId: "B002", customerId: "C789", vehicleId: "V654", pickUpLocation: "Kandy", status: "Pending", dateFrom: "2025-04-10", dateTo: "2025-04-15" },
    { bookingId: "B003", customerId: "C321", vehicleId: "V987", pickUpLocation: "Galle", status: "Confirmed", dateFrom: "2025-04-20", dateTo: "2025-04-25" },
    { bookingId: "B004", customerId: "C654", vehicleId: "V321", pickUpLocation: "Jaffna", status: "Pending", dateFrom: "2025-04-30", dateTo: "2025-05-05" },
    { bookingId: "B005", customerId: "C987", vehicleId: "V789", pickUpLocation: "Nuwara Eliya", status: "Confirmed", dateFrom: "2025-05-10", dateTo: "2025-05-15" },
    { bookingId: "B006", customerId: "C111", vehicleId: "V222", pickUpLocation: "Anuradhapura", status: "Confirmed", dateFrom: "2025-05-20", dateTo: "2025-05-25" },
    { bookingId: "B007", customerId: "C222", vehicleId: "V333", pickUpLocation: "Trincomalee", status: "Pending", dateFrom: "2025-06-01", dateTo: "2025-06-05" },
    { bookingId: "B008", customerId: "C333", vehicleId: "V444", pickUpLocation: "Batticaloa", status: "Confirmed", dateFrom: "2025-06-10", dateTo: "2025-06-15" },
    { bookingId: "B009", customerId: "C444", vehicleId: "V555", pickUpLocation: "Negombo", status: "Pending", dateFrom: "2025-06-20", dateTo: "2025-06-25" },
    { bookingId: "B010", customerId: "C555", vehicleId: "V666", pickUpLocation: "Matara", status: "Confirmed", dateFrom: "2025-07-01", dateTo: "2025-07-05" },
    { bookingId: "B011", customerId: "C666", vehicleId: "V777", pickUpLocation: "Ratnapura", status: "Pending", dateFrom: "2025-07-10", dateTo: "2025-07-15" },
    { bookingId: "B012", customerId: "C777", vehicleId: "V888", pickUpLocation: "Badulla", status: "Confirmed", dateFrom: "2025-07-20", dateTo: "2025-07-25" },
    { bookingId: "B013", customerId: "C888", vehicleId: "V999", pickUpLocation: "Polonnaruwa", status: "Pending", dateFrom: "2025-08-01", dateTo: "2025-08-05" },
    { bookingId: "B014", customerId: "C999", vehicleId: "V000", pickUpLocation: "Kurunegala", status: "Confirmed", dateFrom: "2025-08-10", dateTo: "2025-08-15" },
    { bookingId: "B015", customerId: "C000", vehicleId: "V111", pickUpLocation: "Hambantota", status: "Pending", dateFrom: "2025-08-20", dateTo: "2025-08-25" },
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
    return (
      (booking.customerId.toLowerCase().includes(searchLower) ||
        booking.vehicleId.toLowerCase().includes(searchLower) ||
        booking.pickUpLocation.toLowerCase().includes(searchLower)) &&
      (filterStatus === "" || booking.status === filterStatus)
    );
  });

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Details", 14, 10);
    doc.autoTable({
      head: [["Booking ID", "Customer ID", "Vehicle ID", "Pick-up Location", "Status", "Date From", "Date To"]],
      body: bookings.map((booking) => [
        booking.bookingId,
        booking.customerId,
        booking.vehicleId,
        booking.pickUpLocation,
        booking.status,
        booking.dateFrom,
        booking.dateTo,
      ]),
    });
    doc.save("booking_details.pdf");
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>🚗 Booking Management</Typography>

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
            <MenuItem value="Cancelled">❌ Cancelled</MenuItem>

          </Select>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add Booking</Button>
        </div>

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
            backgroundColor: booking.status === "Confirmed" ? "#4caf50" : 
                   booking.status === "Pending" ? "#ff9800" : "#f44336",
            color: "white",
          }}>
            {booking.status}
          </span>
            </TableCell>
            <TableCell>{booking.dateFrom}</TableCell>
            <TableCell>{booking.dateTo}</TableCell>
            <TableCell>
          <IconButton color="primary" onClick={() => handleOpenDialog(booking)}><Edit /></IconButton>
          <IconButton
            color="error"
            onClick={() => {
                if (window.confirm(`Are you sure you want to delete booking ${booking.bookingId}?`)) {
              setBookings(bookings.filter((b) => b.bookingId !== booking.bookingId));
                }
              }}
            >
              <Delete />
            </IconButton>
            <IconButton color="primary" onClick={() => handlePrintPDF(booking)}><Download /></IconButton>
              </TableCell>
            </TableRow>
          ))}
            </TableBody>
          </Table>
        </TableContainer>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{currentBooking?.bookingId ? "✏️ Edit Booking" : "➕ Add Booking"}</DialogTitle>
            <DialogContent>
              <TextField fullWidth margin="dense" label="Customer ID" value={currentBooking?.customerId || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, customerId: e.target.value })} />
              <TextField fullWidth margin="dense" label="Vehicle ID" value={currentBooking?.vehicleId || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, vehicleId: e.target.value })} />
              <TextField fullWidth margin="dense" label="Pick-up Location" value={currentBooking?.pickUpLocation || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, pickUpLocation: e.target.value })} />
              <Select fullWidth value={currentBooking?.status || ""} onChange={(e) => setCurrentBooking({ ...currentBooking, status: e.target.value })}>
            <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="Pending">⏳ Pending</MenuItem>
            <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
              </Select>
              <TextField
            fullWidth
            margin="dense"
            label="Date From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentBooking?.dateFrom || ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              const today = new Date().toISOString().split("T")[0];
              if (selectedDate < today) {
                alert("Date From cannot be in the past.");
              } else {
                setCurrentBooking({ ...currentBooking, dateFrom: selectedDate });
              }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Date To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentBooking?.dateTo || ""}
            onChange={(e) => {
              const selectedDate = e.target.value;
              if (currentBooking?.dateFrom && selectedDate < currentBooking.dateFrom) {
                alert("Date To cannot be before Date From.");
              } else {
                setCurrentBooking({ ...currentBooking, dateTo: selectedDate });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (currentBooking?.dateFrom && currentBooking?.dateTo && currentBooking.dateTo < currentBooking.dateFrom) {
                alert("Date To cannot be before Date From.");
              } else {
                handleSaveBooking();
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingDetails;
