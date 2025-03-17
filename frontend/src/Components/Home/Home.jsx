/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import carImage from '../Images/car.png'; // Adjust the path according to your project structure
import Footer from "../Footer/Footer";

function Home() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      margin: 0,
      overflow: 'hidden',
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 2s ease-out',
      background: '#ffffff'
    }}>
      <Navbar />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '50px 80px',
          background: '#fff',
          flexWrap: 'wrap',
        }}
      >
        {/* Left Side Text */}
        <Box sx={{ flex: '1 1 50%', paddingRight: '40px' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '2.5rem', lineHeight: 1.2 }}>
            <span style={{ color: '#FFB400' }}>Rent a car</span> and find great deals with us
          </Typography>
          <Typography sx={{ color: '#5C5C5C', margin: '20px 0', fontSize: '0.95rem' }}>
            Choose from a collection of brand new cars, low prices are part of our everyday offer.
          </Typography>
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
          >
            Book online now!
          </Button>
        </Box>

        {/* Right Side Image */}
        <Box
          sx={{
            flex: '1 1 50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #0C84FF, #0073E6)',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <img
            src={carImage}
            alt="Car"
            style={{ width: '100%', maxWidth: '450px', objectFit: 'contain' }}
          />
        </Box>
      </Box>

      <Footer />
    </div>
  );
}

export default Home;
