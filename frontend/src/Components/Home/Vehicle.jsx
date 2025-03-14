import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Header from '../Navbar/Navbar';
import React from 'react';

const VehiclePage = () => {
    const [vehicles, setVehicles] = useState([
        { id: 1, image: "Link", name: "Allion 240", type: "car", fuel: "Petrol", seats: "4", transmission: "Manual", price: 100, status: "Available", ownerID: "U002" },
        { id: 2, image: "Link", name: "Aqua", type: "car", fuel: "Petrol", seats: "4", transmission: "Manual", price: 100, status: "Available", ownerID: "U002" },
        { id: 3, image: "Link", name: "Axio", type: "car", fuel: "Petrol", seats: "4", transmission: "Manual", price: 100, status: "Available", ownerID: "U002" }
    ]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterTransmission, setFilterTransmission] = useState("");
    const [filterFuel, setFilterFuel] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
    
    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleFilterChange = (setter) => (e) => setter(e.target.value);
    const handleCardClick = (vehicle) => setSelectedVehicle(vehicle);
    const handleCloseDialog = () => setSelectedVehicle(null);
    
    const handleAvailabilityToggle = (id) => {
        setVehicles(vehicles.map(v => v.id === id ? { ...v, status: v.status === "Available" ? "Unavailable" : "Available" } : v));
    };

    const handleDelete = (id) => {
        setVehicles(vehicles.filter(v => v.id !== id));
    };

    const handleAddVehicle = () => {
        setVehicles([...vehicles, { id: vehicles.length + 1, ...newVehicle, status: "Available" }]);
        setOpenForm(false);
        setNewVehicle({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
    };
    
    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterType ? v.type === filterType : true) &&
        (filterTransmission ? v.transmission === filterTransmission : true) &&
        (filterFuel ? v.fuel === filterFuel : true)
    );
    
    return (
      <Container>
        <Header />
        <div>
            <TextField label="Search" variant="outlined" fullWidth onChange={handleSearchChange} />
            <Select value={filterType} onChange={handleFilterChange(setFilterType)}>
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="car">Car</MenuItem>
            </Select>
            <Select value={filterTransmission} onChange={handleFilterChange(setFilterTransmission)}>
                <MenuItem value="">All Transmissions</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
            </Select>
            <Select value={filterFuel} onChange={handleFilterChange(setFilterFuel)}>
                <MenuItem value="">All Fuels</MenuItem>
                <MenuItem value="Petrol">Petrol</MenuItem>
            </Select>
            <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>Add Vehicle</Button>
            <Grid container spacing={2}>
                {filteredVehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                        <Card onClick={() => handleCardClick(vehicle)}>
                            <CardMedia component="img" height="140" image={vehicle.image} alt={vehicle.name} />
                            <CardContent>
                                <Typography variant="h6">{vehicle.name}</Typography>
                                <Typography>{vehicle.type} - {vehicle.transmission}</Typography>
                                <Typography>Status: {vehicle.status}</Typography>
                                <Button onClick={(e) => { e.stopPropagation(); handleAvailabilityToggle(vehicle.id); }}>
                                    Toggle Availability
                                </Button>
                                <Button color="secondary" onClick={(e) => { e.stopPropagation(); handleDelete(vehicle.id); }}>
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedVehicle && (
                <Dialog open={Boolean(selectedVehicle)} onClose={handleCloseDialog}>
                    <DialogTitle>{selectedVehicle.name}</DialogTitle>
                    <DialogContent>
                        <Typography>Type: {selectedVehicle.type}</Typography>
                        <Typography>Fuel: {selectedVehicle.fuel}</Typography>
                        <Typography>Seats: {selectedVehicle.seats}</Typography>
                        <Typography>Transmission: {selectedVehicle.transmission}</Typography>
                        <Typography>Price: {selectedVehicle.price}</Typography>
                        <Typography>Status: {selectedVehicle.status}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
            <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })} />
                    <TextField label="Type" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })} />
                    <TextField label="Fuel" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, fuel: e.target.value })} />
                    <TextField label="Seats" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, seats: e.target.value })} />
                    <TextField label="Transmission" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })} />
                    <TextField label="Price" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })} />
                    <TextField label="Image URL" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                    <Button onClick={handleAddVehicle} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
      </Container>
        
    );
};

export default VehiclePage;