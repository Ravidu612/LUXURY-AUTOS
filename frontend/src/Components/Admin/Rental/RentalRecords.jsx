import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Select, MenuItem, InputAdornment, IconButton, Typography
} from "@mui/material";
import { Add, Edit, Delete, Download, Upload, Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RentalRecords = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterpaymentStatus, setFilterpaymentStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchVehicles();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:4000/vehiclebookings");
      if (!response.ok) {
        throw new Error("Failed to fetch sales");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("http://localhost:4000/vehicles");
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const getVehicleType = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
    return vehicle ? vehicle.type : "Unknown";
  };


  const handleOpenAddDialog = () => {
    setCurrentSale({
      saleId: `B00${sales.length + 1}`,
      vehicleId: "",
      paymentStatus: "",
      dateFrom: "",
      dateTo: "",
      customerId: "",
      pickUpLocation: "",
    });
    setOpenAddDialog(true);
  };

  const handleOpenDialog = (sale) => {
    setCurrentSale(sale);
    setOpenDialog(true);
  };

  const filteredSales = sales.filter((sale) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (sale.customerId.toLowerCase().includes(searchLower) ||
        sale.vehicleId.toLowerCase().includes(searchLower) ||
        sale.pickUpLocation.toLowerCase().includes(searchLower)) &&
      (filterpaymentStatus
        === "" || sale.paymentStatus
        === filterpaymentStatus
      )
    );
  });

  const calculatePrice = (vehicleType, period) => {
    const prices = { Car: 15000, Luxury: 50000, Sedan: 25000 };
    const total = prices[vehicleType] ? prices[vehicleType] * period : 0;
    return total.toLocaleString("en-LK", { style: "currency", currency: "LKR" });
  };

  const saveSaleData = async (saleData) => {
    try {
      const response = await fetch("http://localhost:4000/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });
      if (response.ok) {
        console.log("Data saved successfully");
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚗 Approve Rentals
      </Typography>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#eeeeee" }}>
              <TableCell><b>Rental ID</b></TableCell>
              <TableCell><b>Vehicle ID</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Rental Period</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale, index) => {
              const vehicleType = getVehicleType(sale.vehicleId);
              const saleData = {
                vehicleId: sale.vehicleId,
                vehicleType: vehicleType,
                rentalPeriod: `${Math.ceil((new Date(sale.dateTo) - new Date(sale.dateFrom)) / (1000 * 60 * 60 * 24))}`,
                totalAmount: calculatePrice(vehicleType, Math.ceil((new Date(sale.dateTo) - new Date(sale.dateFrom)) / (1000 * 60 * 60 * 24))),
                paymentStatus: sale.status, // Renamed to avoid using deprecated 'status'
              };

              return (
                <TableRow key={sale.saleId || index} hover>
                  <TableCell>{index < 9 ? `R00${index + 1}` : `R0${index + 1}`}</TableCell>
                  <TableCell>{sale.vehicleId}</TableCell>
                  <TableCell>{vehicleType}</TableCell>
                  <TableCell>
                    {`${Math.ceil((new Date(sale.dateTo) - new Date(sale.dateFrom)) / (1000 * 60 * 60 * 24))} days`}
                  </TableCell>
                  <TableCell>
                    {calculatePrice(vehicleType, Math.ceil((new Date(sale.dateTo) - new Date(sale.dateFrom)) / (1000 * 60 * 60 * 24)))}
                  </TableCell>
                  <TableCell>
                    {/* Button to save sale data */}
                    <IconButton color="secondary" onClick={() => saveSaleData(saleData)}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            sale.statuss === "Confirmed"
                              ? "#4caf50"
                              : sale.statuss === "Pending"
                                ? "#ff9800"
                                : "#f44336",
                          color: "white",
                        }}
                      >
                        Approve
                      </span>                    
                      </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RentalRecords;
