import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Download, Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RentalList = () => {
  const [rentals, setRentals] = useState([
    { rentId: "R001", vehicleId: "V456", type: "car", days: "3", status: "Confirmed" },
    { rentId: "R002", vehicleId: "V654", type: "van", days: "5", status: "Pending" },
    { rentId: "R003", vehicleId: "V987", type: "bike", days: "7", status: "Confirmed" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRental, setCurrentRental] = useState(null);
  const [errors, setErrors] = useState({}); // State for validation errors

  const handleOpenDialog = (rental = null) => {
    setCurrentRental(rental || { rentId: `R00${rentals.length + 1}`, type: "", vehicleId: "", days: "", status: "" });
    setErrors({}); // Reset errors when opening the dialog
    setOpenDialog(true);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!currentRental.vehicleId) newErrors.vehicleId = "Vehicle ID is required.";
    if (!currentRental.days || currentRental.days <= 0) newErrors.days = "Days must be greater than 0.";
    if (!currentRental.type) newErrors.type = "Type is required.";
    if (!currentRental.status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSaveRental = () => {
    if (!validateFields()) return; // Stop if validation fails

    setRentals((prev) => {
      const exists = prev.find((r) => r.rentId === currentRental.rentId);
      return exists ? prev.map((r) => (r.rentId === currentRental.rentId ? currentRental : r)) : [...prev, currentRental];
    });
    setOpenDialog(false);
  };

  const filteredRentals = rentals.filter((rental) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (rental.type.toLowerCase().includes(searchLower) ||
        rental.vehicleId.toLowerCase().includes(searchLower)) &&
      (filterStatus === "" || rental.status === filterStatus)
    );
  });

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Rental Details", 14, 10);
    doc.autoTable({
      head: [["Rental ID", "Vehicle ID", "Days", "Type", "Price", "Status"]],
      body: rentals.map((rental) => [
        rental.rentId,
        rental.vehicleId,
        rental.days,
        rental.type,
        rental.days * (rental.type === "car" ? 15000 : rental.type === "bike" ? 5000 : 25000),
        rental.status,
      ]),
    });
    doc.save("rental_details.pdf");
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>🚗 Rental Management</Typography>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <TextField
          label="Search Type/Vehicle"
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
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add Rental</Button>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#eeeeee" }}>
              <TableCell><b>Rental ID</b></TableCell>
              <TableCell><b>Vehicle ID</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Days</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.map((rental) => (
              <TableRow key={rental.rentId} hover>
                <TableCell>{rental.rentId}</TableCell>
                <TableCell>{rental.vehicleId}</TableCell>
                <TableCell>{rental.type}</TableCell>
                <TableCell>{rental.days}</TableCell>
                <TableCell>
                  {rental.type === "car" && rental.days * 15000}
                  {rental.type === "bike" && rental.days * 5000}
                  {rental.type === "van" && rental.days * 25000}
                </TableCell>
                <TableCell>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: rental.status === "Confirmed" ? "#4caf50" : "#ff9800",
                    color: "white",
                  }}>
                    {rental.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(rental)}><Edit /></IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete rental ${rental.rentId}?`)) {
                        setRentals(rentals.filter((r) => r.rentId !== rental.rentId));
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handlePrintPDF(rental)}><Download /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentRental?.rentId ? "✏️ Edit Rental" : "➕ Add Rental"}</DialogTitle>
        <DialogContent>
          Input Vehicle ID
          <TextField
            fullWidth
            margin="dense"
            value={currentRental?.vehicleId || ""}
            onChange={(e) => setCurrentRental({ ...currentRental, vehicleId: e.target.value })}
            error={!!errors.vehicleId}
            helperText={errors.vehicleId}
          />
          Input Days
          <TextField
            fullWidth
            margin="dense"
            type="number"
            value={currentRental?.days || ""}
            onChange={(e) => setCurrentRental({ ...currentRental, days: e.target.value })}
            error={!!errors.days}
            helperText={errors.days}
          />
          Select Status
          <Select
            fullWidth
            margin="dense"
            value={currentRental?.status || ""}
            onChange={(e) => setCurrentRental({ ...currentRental, status: e.target.value })}
            error={!!errors.status}
          >
            <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="Pending">⏳ Pending</MenuItem>
          </Select>
          {errors.status && <Typography color="error">{errors.status}</Typography>}
          Select Type
          <Select
            fullWidth
            margin="dense"
            value={currentRental?.type || ""}
            onChange={(e) => setCurrentRental({ ...currentRental, type: e.target.value })}
            error={!!errors.type}
          >
            <MenuItem value="car">Car</MenuItem>
            <MenuItem value="van">Van</MenuItem>
            <MenuItem value="bike">Bike</MenuItem>
          </Select>
          {errors.type && <Typography color="error">{errors.type}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveRental}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RentalList;