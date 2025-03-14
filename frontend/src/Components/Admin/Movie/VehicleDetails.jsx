import React, { useState } from "react";
import {
    Card, CardContent, CardMedia, Typography, Grid, Container,
    TextField, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Box
} from "@mui/material";
import { vehicles as initialVehicles } from "../../Admin/Database/Data";

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [open, setOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const handleDelete = (id) => {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    };

    const toggleAvailability = (id) => {
        setVehicles(vehicles.map(vehicle => vehicle.id === id ? { ...vehicle, status: vehicle.status === "Available" ? "Unavailable" : "Available" } : vehicle));
    };

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingVehicle(null);
    };

    const handleSave = () => {
        setVehicles(vehicles.map(vehicle => vehicle.id === editingVehicle.id ? editingVehicle : vehicle));
        handleClose();
    };

    const handleChange = (e) => {
        setEditingVehicle({ ...editingVehicle, [e.target.name]: e.target.value });
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterType ? vehicle.type === filterType : true)
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Search Vehicles"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Car">Car</MenuItem>
                    <MenuItem value="Bike">Bike</MenuItem>
                    <MenuItem value="Van">Van</MenuItem>
                </Select>
            </Box>
            <Grid container spacing={3}>
                {filteredVehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={vehicle.image}
                                alt={vehicle.name}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" fontWeight={600}>{vehicle.name}</Typography>
                                <Typography variant="body2" color="text.secondary">Transmission: {vehicle.transmission}</Typography>
                                <Typography variant="body2" color="text.secondary">Price: ${vehicle.price} per day</Typography>
                                <Typography variant="body2" color={vehicle.status === "Available" ? "green" : "red"}>Status: {vehicle.status}</Typography>
                                <Box display="flex" gap={1} mt={2}>
                                    <Button variant="contained" color={vehicle.status === "Available" ? "success" : "warning"} onClick={() => toggleAvailability(vehicle.id)}>
                                        {vehicle.status === "Available" ? "Make Unavailable" : "Make Available"}
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(vehicle.id)}>
                                        Delete
                                    </Button>
                                    <Button variant="contained" color="info" onClick={() => handleEdit(vehicle)}>
                                        Edit
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Vehicle Details</DialogTitle>
                <DialogContent>
                    {editingVehicle && (
                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <TextField label="Name" name="name" value={editingVehicle.name} onChange={handleChange} fullWidth />
                            <TextField label="Price" name="price" type="number" value={editingVehicle.price} onChange={handleChange} fullWidth />
                            <TextField label="Transmission" name="transmission" value={editingVehicle.transmission} onChange={handleChange} fullWidth />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VehicleDetails;
