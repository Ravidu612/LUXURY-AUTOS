/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edit, Delete, Print, Add } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddVehicle from './AddVehicle';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:4000/Vehicles";

const fetchVehicle = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function VehicleDetails() {
  const [Vehicle, setVehicle] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [view, setView] = useState('table'); // Toggle between 'table' and 'stats' view

  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicle().then(data => {
      setVehicle(data);
    }).catch(error => {
      console.error("Error fetching Vehicle:", error);
    });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-Vehicle/${id}`);
  };

  const deleteVehicle = async (id) => {
    try {
      const response = await axios.delete(`${URL}/${id}`);
      if (response.status === 200) {
        setVehicle(prev => prev.filter(item => item._id !== id));
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting Vehicle:", error.response ? error.response.data : error.message);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    
    // Add the main topic as the title
    doc.setFontSize(18);
    doc.text("LUXURY AUTOS ", 10, 10);
    
    // Add a subtitle or description if needed
    doc.setFontSize(12);
    doc.text("Vehicle Details Report", 10, 20);

    doc.autoTable({
      head: [['Vehicle ID', 'Name', 'Fuel', 'Seating', 'Transmission', 'Price', 'Rate', 'Description', 'Status']],
      body: Vehicle.map(item => [
        item.VID, 
        item.name, 
        item.fuel, 
        item.seating, 
        item.transmission, 
        item.price, 
        item.rate, 
        item.description, 
        item.status
      ]),
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

    doc.save('Vehicle-details.pdf');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchVehicle().then(data => {
        setVehicle(data);
        setNoResults(false);
      }).catch(error => {
        console.error("Error fetching Vehicle:", error);
      });
      return;
    }

    const filteredVehicle = Vehicle.filter(item =>
      Object.values(item).some(field =>
        field && field.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setVehicle(filteredVehicle);
    setNoResults(filteredVehicle.length === 0);
  };

  const handleAddVehicle = () => {
    setShowAddVehicleForm(true);
  };

  const handleBack = () => {
    setShowAddVehicleForm(false);
  };

  // Calculate statistics
  const totalVehicles = Vehicle.length;
  const averageRating = totalVehicles > 0 ? (Vehicle.reduce((acc, item) => acc + item.rate, 0) / totalVehicles) : 0;
  const statusDistribution = Vehicle.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  // Render the statistics view
  const renderStatsView = () => (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>Total Vehicles: {totalVehicles}</Typography>
      <Typography variant="h6" gutterBottom>Average Rating: {averageRating.toFixed(2)}</Typography>
      <Typography variant="h6" gutterBottom>Status Distribution:</Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(statusDistribution).map(([status, count]) => (
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
      {showAddVehicleForm ? (
        <Box>
          <AddVehicle onBack={handleBack} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch} // Update to call handleSearch on change
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
              onClick={handleAddVehicle}
              sx={{ borderRadius: 2, marginLeft: 2 }}
              startIcon={<Add />}
            >
              Add Vehicle
            </Button>
          </Box>

          {view === 'table' ? (
            <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
              <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle ID</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Fuel</TableCell>
                      <TableCell>Seating</TableCell>
                      <TableCell>Transmission</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Ratings</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noResults ? (
                      <TableRow>
                        <TableCell colSpan={11} align="center">No Vehicle found.</TableCell>
                      </TableRow>
                    ) : (
                      Vehicle.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.VID}</TableCell>
                          <TableCell>
                            <img src={item.image || 'default-image-path'} alt={item.name} style={{ width: '50px', height: '50px' }} />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.fuel}</TableCell>
                          <TableCell>{item.seating}</TableCell>
                          <TableCell>{item.transmission}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>{item.rate}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(item._id)} sx={{ color: 'primary.main' }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteVehicle(item._id)} sx={{ color: 'error.main' }}>
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

export default VehicleDetails;