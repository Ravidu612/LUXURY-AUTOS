/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const URL = "http://localhost:4000/Vehicles";

function Vehicle() {
  const { id } = useParams(); // Changed MID to id
  const [Vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        setVehicle(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Vehicle details:', error);
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!Vehicle) return <Typography>No Vehicle found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vehicle Details
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6">ID: {Vehicle.VID}</Typography>
        <Typography variant="h6">Image:</Typography>
        <img src={Vehicle.image || 'default-image-path'} alt={Vehicle.name} style={{ width: '150px', height: '150px' }} />
        <Typography variant="h6">Name: {Vehicle.name}</Typography>
        <Typography variant="h6">Fuel: {Vehicle.fuel}</Typography>
        <Typography variant="h6">Seating: {Vehicle.seating}</Typography>
        <Typography variant="h6">Transmission: {Vehicle.transmission}</Typography>
        <Typography variant="h6">Price: ${Vehicle.price}</Typography>
        <Typography variant="h6">Description: {Vehicle.description}</Typography>
        <Typography variant="h6">Status: {Vehicle.status}</Typography>
      </Paper>
    </Box>
  );
}

export default Vehicle;
