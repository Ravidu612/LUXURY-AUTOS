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
    CardMedia,
} from "@mui/material";

import Footer from "../Footer/Footer";
import Header from "../Navbar/Navbar";
// Removed unused Link import

const VehiclePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "" });
    const [openViewDialog, setOpenViewDialog] = useState(false);
    // Removed unused editMode state
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

    const handleSaveVehicle = async () => {
        try {
            if (selectedVehicle._id) {
                await axios.put(`http://localhost:4000/vehicles/${selectedVehicle._id}`, selectedVehicle);
                setSnackbarMessage('Vehicles updated successfully!');
            } else {
                await axios.post('http://localhost:4000/vehicles', selectedVehicle);
                setSnackbarMessage('Vehicles added successfully!');
            }
            setSnackbarOpen(true);
            setOpenViewDialog(false);
            fetchProperties();
        } catch (error) {
            console.error('Error saving Vehicle:', error);
        }
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
                        <Card sx={{ cursor: "pointer", height: "100%" }} onClick={() => { setOpenViewDialog(true); setSelectedVehicle(vehicle); }}>
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setOpenViewDialog(true); setSelectedVehicle(vehicle); }}
                                    sx={{ marginTop: 1 }}
                                >
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
                <DialogTitle>{selectedVehicle ? 'Booking Details' : 'Add Vehicle'}</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Name: {selectedVehicle.name}
                            </Typography>
                            <CardMedia
                                component="img"
                                style={{ width: '200px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                                image={selectedVehicle.image}
                                alt={selectedVehicle.name}
                            />
                            <Typography variant="subtitle1" gutterBottom>
                                Select Pickup Location:
                            </Typography>
                            <div style={{ height: '300px', width: '100%' }}>
                                <iframe
                                    title="Map"
                                    src={`https://www.google.com/maps?q=${selectedVehicle.location || "WX7F+V5+Malabe,+Sri+Lanka"}&output=embed`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                            const location = `${position.coords.latitude},${position.coords.longitude}`;
                                            setSelectedVehicle((prev) => ({ ...prev, location }));
                                        },
                                        (error) => {
                                            console.error("Error fetching location:", error);
                                        }
                                    );
                                }}
                                sx={{ marginTop: 2 }}
                            >
                                Use My Location
                            </Button>
                            <TextField
                                label="Pickup Location"
                                value={selectedVehicle.location || ""}
                                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, location: e.target.value })}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: new Date().toISOString().split("T")[0],
                                }}
                                onChange={(e) => console.log("Selected Start Date:", e.target.value)}
                            />
                            <br /><br />
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: new Date().toISOString().split("T")[0],
                                }}
                                onChange={(e) => console.log("Selected End Date:", e.target.value)}
                            />

                            <Typography variant="subtitle1" gutterBottom>
                                Status: {selectedVehicle.status}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)} color="secondary">
                        Close
                    </Button>
                    <Button onClick={handleSaveVehicle} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </Box>
    );
};

export default VehiclePage;
