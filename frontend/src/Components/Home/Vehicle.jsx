import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Container } from "@mui/material";
import Header from '../Navbar/Navbar';

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
                <TextField 
                    label="Search" 
                    variant="outlined" 
                    fullWidth 
                    onChange={handleSearchChange} 
                    style={{ marginBottom: '20px' }} 
                />
                <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                    <Grid item xs={12} sm={4}>
                        <Select 
                            value={filterType} 
                            onChange={handleFilterChange(setFilterType)} 
                            fullWidth 
                            displayEmpty
                        >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="car">Car</MenuItem>
                            <MenuItem value="van">Van</MenuItem>
                            <MenuItem value="bike">Bike</MenuItem>
                            <MenuItem value="bus">Bus</MenuItem>
                            <MenuItem value="heavy duty">Heavy duty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Select 
                            value={filterTransmission} 
                            onChange={handleFilterChange(setFilterTransmission)} 
                            fullWidth 
                            displayEmpty
                        >
                            <MenuItem value="">All Transmissions</MenuItem>
                            <MenuItem value="Manual">Manual</MenuItem>
                            <MenuItem value="Auto">Auto</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Select 
                            value={filterFuel} 
                            onChange={handleFilterChange(setFilterFuel)} 
                            fullWidth 
                            displayEmpty
                        >
                            <MenuItem value="">All Fuels</MenuItem>
                            <MenuItem value="Petrol">Petrol</MenuItem>
                            <MenuItem value="Diesel">Diesel</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
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
                                        {vehicle.status === "Available" ? "Mark as Unavailable" : "Mark as Available"}
                                    </Button>
                                    <Button onClick={(e) => { e.stopPropagation(); alert('Booking functionality not implemented yet.'); }}>
                                        Book Now
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
            </div>
        </Container>
    );
};

export default VehiclePage;