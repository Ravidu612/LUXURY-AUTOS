import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import jsPDF from "jspdf";
import { vehicles as initialVehicles } from "../Database/Data";
import axios from 'axios';

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterTransmission, setFilterTransmission] = useState("");
    const [filterFuel, setFilterFuel] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
    const [filteredVehicles, setFilteredVehicles] = useState(initialVehicles);
    const [isEditing, setIsEditing] = useState(false);
    
    const handleAddVehicle = async () => {
        if (!newVehicle.name || !newVehicle.type || !newVehicle.fuel || !newVehicle.seats || !newVehicle.transmission || !newVehicle.price || !newVehicle.image) {
            alert("Please fill all fields!");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:4000/Vehicles', newVehicle);
            const newEntry = response.data.Vehicle;
            setVehicles([...vehicles, newEntry]);
    
            setOpenForm(false);
            setNewVehicle({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
        } catch (error) {
            console.error("There was an error adding the vehicle!", error);
            alert("There was an error adding the vehicle!");
        }
    };
    
    // ...existing code...
    useEffect(() => {
        const filtered = vehicles.filter(v =>
            (filterType ? v.type === filterType : true) &&
            (filterTransmission ? v.transmission === filterTransmission : true) &&
            (filterFuel ? v.fuel === filterFuel : true) &&
            (search ? v.name.toLowerCase().includes(search.toLowerCase()) : true)
        );
        setFilteredVehicles(filtered);
    }, [vehicles, filterType, filterTransmission, filterFuel, search]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditVehicle = (vehicle) => {
        setNewVehicle(vehicle);
        setIsEditing(true);
        setOpenForm(true);
    };

    const handleUpdateVehicle = () => {
        if (!newVehicle.name || !newVehicle.type || !newVehicle.fuel || !newVehicle.seats || !newVehicle.transmission || !newVehicle.price || !newVehicle.image) {
            alert("Please fill all fields!");
            return;
        }

        setVehicles(vehicles.map(v => v.id === newVehicle.id ? newVehicle : v));

        setOpenForm(false);
        setIsEditing(false);
        setNewVehicle({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
    };

    const handleDownloadPDF = (vehicle) => {
        const doc = new jsPDF();
        doc.text(`Vehicle Details`, 10, 10);
        doc.text(`Name: ${vehicle.name}`, 10, 20);
        doc.text(`Type: ${vehicle.type}`, 10, 30);
        doc.text(`Fuel: ${vehicle.fuel}`, 10, 40);
        doc.text(`Seats: ${vehicle.seats}`, 10, 50);
        doc.text(`Transmission: ${vehicle.transmission}`, 10, 60);
        doc.text(`Price: $${vehicle.price}`, 10, 70);
        doc.text(`Status: ${vehicle.status}`, 10, 80);
        doc.save(`${vehicle.name}_details.pdf`);
    };

    return (
        <div>
            <TextField label="Search" variant="outlined" size="small" style={{ width: "250px", marginBottom: "10px" }} onChange={handleSearchChange} />

            <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                <Select value={filterType} onChange={handleFilterChange(setFilterType)} displayEmpty>
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="van">Van</MenuItem>
                    <MenuItem value="bike">Bike</MenuItem>
                    <MenuItem value="bus">Bus</MenuItem>
                    <MenuItem value="heavy duty">Heavy Duty</MenuItem>
                </Select>

                <Select value={filterTransmission} onChange={handleFilterChange(setFilterTransmission)} displayEmpty>
                    <MenuItem value="">All Transmissions</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                </Select>

                <Select value={filterFuel} onChange={handleFilterChange(setFilterFuel)} displayEmpty>
                    <MenuItem value="">All Fuels</MenuItem>
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                </Select>

                <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>Add Vehicle</Button>
            </div>

            {/* Add/Edit Vehicle Form */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" name="name" value={newVehicle.name} onChange={handleInputChange} fullWidth margin="normal" />

                    <Select
                        name="type"
                        value={newVehicle.type}
                        onChange={handleInputChange}
                        fullWidth
                        displayEmpty
                        margin="normal"
                    >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="car">Car</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                        <MenuItem value="bike">Bike</MenuItem>
                        <MenuItem value="bus">Bus</MenuItem>
                        <MenuItem value="heavy duty">Heavy Duty</MenuItem>
                    </Select>

                    <Select
                        name="fuel"
                        value={newVehicle.fuel}
                        onChange={handleInputChange}
                        fullWidth
                        displayEmpty
                        margin="normal"
                    >
                        <MenuItem value="">Select Fuel Type</MenuItem>
                        <MenuItem value="Petrol">Petrol</MenuItem>
                        <MenuItem value="Diesel">Diesel</MenuItem>
                    </Select>

                    <TextField label="Seats" name="seats" value={newVehicle.seats} onChange={handleInputChange} fullWidth margin="normal" />

                    <Select
                        name="transmission"
                        value={newVehicle.transmission}
                        onChange={handleInputChange}
                        fullWidth
                        displayEmpty
                        margin="normal"
                    >
                        <MenuItem value="">Select Transmission</MenuItem>
                        <MenuItem value="Manual">Manual</MenuItem>
                        <MenuItem value="Automatic">Automatic</MenuItem>
                    </Select>

                    <TextField label="Price" name="price" value={newVehicle.price} onChange={handleInputChange} fullWidth margin="normal" />
                    <TextField label="Image URL" name="image" value={newVehicle.image} onChange={handleInputChange} fullWidth margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)} color="primary">Cancel</Button>
                    <Button onClick={isEditing ? handleUpdateVehicle : handleAddVehicle} color="primary">{isEditing ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>

            {/* Vehicle Details Dialog */}
            <Dialog open={!!selectedVehicle} onClose={handleCloseDialog}>
                <DialogTitle>Vehicle Details</DialogTitle>
                {selectedVehicle && (
                    <DialogContent>
                        <CardMedia component="img" height="140" image={selectedVehicle.image} alt={selectedVehicle.name} />
                        <Typography variant="h6">{selectedVehicle.name}</Typography>
                        <Typography>Type: {selectedVehicle.type}</Typography>
                        <Typography>Fuel: {selectedVehicle.fuel}</Typography>
                        <Typography>Seats: {selectedVehicle.seats}</Typography>
                        <Typography>Transmission: {selectedVehicle.transmission}</Typography>
                        <Typography>Price: ${selectedVehicle.price}</Typography>
                        <Typography>Status: {selectedVehicle.status}</Typography>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                    {selectedVehicle && (
                        <Button onClick={() => handleDownloadPDF(selectedVehicle)} color="primary">Download PDF</Button>
                    )}
                </DialogActions>
            </Dialog>

            <Grid container spacing={2}>
                {filteredVehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                        <Card onClick={() => handleCardClick(vehicle)}>
                            <CardMedia component="img" height="140" image={vehicle.image} alt={vehicle.name} />
                            <CardContent>
                                <Typography variant="h6">{vehicle.name}</Typography>
                                <Typography>{vehicle.type} - {vehicle.transmission}</Typography>
                                <Typography>Status: {vehicle.status}</Typography>
                                <Button onClick={(e) => { e.stopPropagation(); handleAvailabilityToggle(vehicle.id); }}>Toggle Availability</Button>
                                <Button color="secondary" onClick={(e) => { e.stopPropagation(); handleDelete(vehicle.id); }}>Delete</Button>
                                <Button color="primary" onClick={(e) => { e.stopPropagation(); handleEditVehicle(vehicle); }}>Edit</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default VehicleDetails;