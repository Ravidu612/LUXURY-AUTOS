import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Download, Search } from "@mui/icons-material";

const RentalList = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterpaymentStatus, setFilterpaymentStatus] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:4000/sales");
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const handleDeleteRental = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/sales/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete rental");
      }
      setSales(sales.filter((sale) => sale._id !== id));
    } catch (error) {
      console.error("Error deleting rental:", error);
    }
  };

  const handleOpenEditDialog = (sale) => {
    setSelectedSale(sale);
    setNewPaymentStatus(sale.paymentStatus);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedSale(null);
    setNewPaymentStatus("");
  };

  const handleUpdatePaymentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:4000/sales/${selectedSale._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }
      const updatedSale = await response.json();
      setSales(sales.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale)));
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const filteredSales = sales.filter((sale) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (sale.saleId.toLowerCase().includes(searchLower) ||
        sale.vehicleId.toLowerCase().includes(searchLower)) &&
      (filterpaymentStatus === "" || sale.paymentStatus === filterpaymentStatus)
    );
  });

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚗 Rental Management
      </Typography>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <TextField
          label="Search Rental"
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
        <Select
          value={filterpaymentStatus}
          onChange={(e) => setFilterpaymentStatus(e.target.value)}
          displayEmpty
          variant="outlined"
          style={{ minWidth: "150px" }}
        >
          <MenuItem value="">All payment statuses</MenuItem>
          <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
          <MenuItem value="Pending">⏳ Pending</MenuItem>
          <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
        </Select>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#eeeeee" }}>
              <TableCell><b>Rental ID</b></TableCell>
              <TableCell><b>Vehicle ID</b></TableCell>
              <TableCell><b>Rental Period</b></TableCell>
              <TableCell><b>Total Amount</b></TableCell>
              <TableCell><b>Payment Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale._id} hover>
                <TableCell>{sale.saleId}</TableCell>
                <TableCell>{sale.vehicleId}</TableCell>
                <TableCell>{`${sale.rentalPeriod} days`}</TableCell>
                <TableCell>{sale.totalAmount}</TableCell>
                <TableCell>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor:
                      sale.paymentStatus === "Confirmed"
                        ? "#4caf50"
                        : sale.paymentStatus === "Pending"
                          ? "#ff9800"
                          : "#f44336",
                    color: "white",
                  }}>
                    {sale.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenEditDialog(sale)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteRental(sale._id)}><Delete /></IconButton>
                  <IconButton color="primary"><Download /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Payment Status</DialogTitle>
        <DialogContent>
          <Select
            value={newPaymentStatus}
            onChange={(e) => setNewPaymentStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="Pending">⏳ Pending</MenuItem>
            <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
          <Button onClick={handleUpdatePaymentStatus} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RentalList;
