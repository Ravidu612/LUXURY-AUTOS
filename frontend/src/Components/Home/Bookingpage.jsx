import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';


const BookingPage = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [toTime, setToTime] = useState(null);

  const locations = [
    "Arugam Bay town limits only - Arugam Bay town limits only, Sri Lanka",
    "Colombo City - Colombo City, Sri Lanka",
    "Kandy City - Kandy City, Sri Lanka",
  ];

  const handleSearch = () => {
    console.log({
      pickupLocation,
      dropoffLocation,
      fromDate,
      fromTime,
      toDate,
      toTime,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          my: 5,
          p: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" sx={{ color: '#f97316', mb: 2, fontWeight: 700 }}>
          Book Now
        </Typography>

        {/* Pickup Location */}
        <TextField
          select
          label="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          fullWidth
          margin="normal"
        >
          {locations.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </TextField>

        {/* Drop off Location */}
        <TextField
          select
          label="Drop off Location"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          fullWidth
          margin="normal"
        >
          {locations.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </TextField>

        {/* From and To Dates */}
        <Box mt={2}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            From
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <DatePicker
                label="Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Time"
                value={fromTime}
                onChange={(newValue) => setFromTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={2}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            To
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <DatePicker
                label="Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Time"
                value={toTime}
                onChange={(newValue) => setToTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Search Button */}
        <Box mt={4}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#059669',
              '&:hover': { backgroundColor: '#047857' },
              color: '#fff',
              py: 1.5,
              fontWeight: 600,
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingPage;