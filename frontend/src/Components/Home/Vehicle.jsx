import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Box,
    TextField,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
} from "@mui/material";

import Footer from "../Footer/Footer";
import Header from "../Navbar/Navbar";
import { Link } from "react-router-dom";

const VehiclePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "" });
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get("http://localhost:4000/vehicles");
                setVehicles(response.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };
        fetchVehicles();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.type ? vehicle.type === filters.type : true) &&
        (filters.fuel ? vehicle.fuel === filters.fuel : true) &&
        (filters.transmission ? vehicle.transmission === filters.transmission : true)
    );

    return (
        <Box sx={{ padding: 3 }}>
            <Header />

            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                    fullWidth
                    label="Search Vehicles"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <Select
                    fullWidth
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Sedan">Sedan</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Truck">Truck</MenuItem>
                    <MenuItem value="Bus">Bus</MenuItem>
                    <MenuItem value="Bike">Bike</MenuItem>
                    <MenuItem value="Van">Van</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="fuel"
                    value={filters.fuel}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Fuel Types</MenuItem>
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Transmissions</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                </Select>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {filteredVehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.vehicleId}>
                            <Card sx={{ cursor: "pointer", height: "100%" }} onClick={() => { setOpenViewDialog(true); setSelectedVehicle(property); }}>
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{vehicle.name}</Typography>
                                    <Typography color="textSecondary">{vehicle.type}</Typography>
                                    <Typography variant="body2">Fuel: {vehicle.fuel}</Typography>
                                    <Typography variant="body2">Seats: {vehicle.seats}</Typography>
                                    <Typography variant="body2">Transmission: {vehicle.transmission}</Typography>
                                    <Typography variant="body2">Price: ${vehicle.price}</Typography>
                                    <Typography variant="body2">Status: {vehicle.status}</Typography>
                                </CardContent>
                            </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
                <DialogTitle>{editMode ? 'Property Details' : 'Add Property'}</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Name:{selectedProperty.name}
                            </Typography>
                            <CardMedia
                                component="img"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                                image={selectedProperty.images?.[0] || 'default-image-path'}
                                alt={selectedProperty.name}
                            />
                            <Typography variant="subtitle1" gutterBottom>
                                Size:{selectedProperty.size}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                Address:{selectedProperty.address}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                Price:{selectedProperty.price}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                Status:{selectedProperty.status}
                            </Typography>

                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
};

export default VehiclePage;
