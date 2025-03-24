import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edit, Delete, Print, Add, ArrowBack } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/sales";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function SalesDetails() {
  const [allSales, setAllSales] = useState([]);
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddSalesForm, setShowAddSalesForm] = useState(false);
  const [view, setView] = useState('table'); // For toggling views (table or stats)

  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => {
      setAllSales(data);
      setSales(data);
    }).catch(error => {
      console.error("Error fetching sales:", error);
    });
  }, []);

  const handleEdit = (saleId) => {
    navigate(`/admindashboard/update-sale/${saleId}`);
  };

  const deleteSale = async (saleId) => {
    try {
      const response = await axios.delete(`${URL}/${saleId}`);
      if (response.status === 200) {
        setAllSales(prev => prev.filter(sale => sale._id !== saleId));
        setSales(prev => prev.filter(sale => sale._id !== saleId));
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting sale:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    
    // Add the main topic as the title
    doc.setFontSize(18);
    doc.text("LUXURY AUTOS", 10, 10);
    
    // Add a subtitle or description if needed
    doc.setFontSize(12);
    doc.text("Sales Details Report", 10, 20);

    doc.autoTable({
      head: [['Sale ID', 'Vehicle ID', 'Customer ID', 'Rental Period', 'Total Amount', 'Payment Status']],
      body: sales.map(sale => [sale._id, sale.vehicleId, sale.customerId, sale.rentalPeriod, `$${sale.totalAmount}`, sale.paymentStatus]),
      startY: 30, // Adjust the starting position to leave space for the title
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

    doc.save('sales-details.pdf');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSales(allSales);
      setNoResults(false);
      return;
    }

    const filteredSales = allSales.filter(sale =>
      Object.values(sale).some(field =>
        field && field.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setSales(filteredSales);
    setNoResults(filteredSales.length === 0);
  };

  const handleAddSales = () => {
    setShowAddSalesForm(true);
  };

  const handleBack = () => {
    setShowAddSalesForm(false);
  };

  // Calculate statistics
  const totalSales = sales.length;
  const paymentStatusDistribution = sales.reduce((acc, sale) => {
    acc[sale.paymentStatus] = (acc[sale.paymentStatus] || 0) + 1;
    return acc;
  }, {});

  // Render the statistics view
  const renderStatsView = () => (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>Total Sales: {totalSales}</Typography>
      <Typography variant="h6" gutterBottom>Payment Status Distribution:</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Status</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(paymentStatusDistribution).map(([status, count]) => (
              <TableRow key={status}>
                <TableCell>{status}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Handle view change
  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ marginBottom: 2, borderRadius: 2 }}
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      {showAddSalesForm ? (
        <Box>
          <AddSales onBack={handleBack} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                flexShrink: 1,
                width: '200px',
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              sx={{ marginLeft: 'auto' }}
            >
              <ToggleButton value="table">Table View</ToggleButton>
              <ToggleButton value="stats">Stats View</ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddSales}
              sx={{ borderRadius: 2, marginLeft: 2 }}
              startIcon={<Add />}
            >
              Add Sale
            </Button>
          </Box>

          {view === 'table' ? (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sale ID</TableCell>
                      <TableCell>Vehicle ID</TableCell>
                      <TableCell>Customer ID</TableCell>
                      <TableCell>Rental Period</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Payment Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noResults ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">No sales found.</TableCell>
                      </TableRow>
                    ) : (
                      sales.map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell>{sale._id}</TableCell>
                          <TableCell>{sale.vehicleId}</TableCell>
                          <TableCell>{sale.customerId}</TableCell>
                          <TableCell>{sale.rentalPeriod} days</TableCell>
                          <TableCell>${sale.totalAmount}</TableCell>
                          <TableCell>{sale.paymentStatus}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(sale._id)} sx={{ color: 'primary.main' }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteSale(sale._id)} sx={{ color: 'error.main' }}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                color="primary"
                onClick={handlePDF}
                sx={{ marginTop: 2, borderRadius: 2 }}
              >
                <Print /> Download
              </Button>
            </Box>
          ) : (
            renderStatsView()
          )}
        </>
      )}
    </Box>
  );
}

export default SalesDetails;