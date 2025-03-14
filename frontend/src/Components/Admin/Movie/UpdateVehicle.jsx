/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Description } from '@mui/icons-material';

const URL = "http://localhost:4000/Vehicles";

function UpdateVehicle() {
  const { MID } = useParams();
  const [Vehicle, setVehicle] = useState({
    image: '',
    name: '',
    rate: '',
    description: '',
    status: 'available'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching Vehicle with MID:", MID);
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${URL}/${MID}`);
        console.log("Fetched Vehicle data:", response.data);
        setVehicle(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Vehicle:", error);
        setError(error.response ? error.response.data.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [MID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...Vehicle, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${MID}`, Vehicle);
      alert('Vehicle updated successfully');
      navigate('/admindashboard/Vehicle-management');
    } catch (error) {
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Update Vehicle</Typography>
      <TextField
        label="Image URL"
        name="image"
        value={Vehicle.image}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        name="name"
        value={Vehicle.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ratings"
        name="price"
        type="number"
        value={Vehicle.rate}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="quantity"
        value={Vehicle.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Status"
        name="status"
        select
        SelectProps={{ native: true }}
        value={Vehicle.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <option value="Now Showing!">Now Showing!</option>
        <option value="Up Coming!">Up Coming!</option>
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Vehicle
      </Button>
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default UpdateVehicle;
