/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../Navbar/Navbar';
import carImage from '../Images/car.png'; // Adjust the path accordingly
import Footer from '../Footer/Footer';

function Home() {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', margin: 0, overflow: 'hidden', opacity: fadeIn ? 1 : 0, transition: 'opacity 2s ease-out', background: '#ffffff' }}>
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 80px',
          background: '#fff',
          flexWrap: 'wrap',
          minHeight: '80vh',
        }}
      >
        {/* Left Side: Image */}
        <Box sx={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={carImage}
            alt="Luxury Car"
            style={{
              width: '100%',
              maxWidth: '50%', // Ensures the image takes up half the page width
              objectFit: 'contain',
              borderRadius: '10px',
            }}
          />
        </Box>

        {/* Right Side: Description */}
        <Box sx={{ flex: '1 1 50%', paddingLeft: '40px' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '2.5rem', lineHeight: 1.2 }}>
            <span style={{ color: '#FFB400' }}>Luxury Autos</span> for Premium Comfort
          </Typography>
          <Typography sx={{ color: '#5C5C5C', margin: '20px 0', fontSize: '0.95rem' }}>
          Unlock unforgettable memories on the road          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFB400',
              color: '#fff',
              padding: '10px 30px',
              borderRadius: '25px',
              textTransform: 'none',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': { backgroundColor: '#e5a200' },
            }}
            onClick={() => navigate('/vehicles')} // Navigate to VehiclePage
          >
            OUR VEHICLES
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;