import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const defaultVehicleDetails = [
    {
        vehicleId: "V123",
        image: "https://media.ed.edmunds-media.com/toyota/corolla-hatchback/2025/oem/2025_toyota_corolla-hatchback_4dr-hatchback_nightshade_fq_oem_1_1600.jpg",
        name: "Toyota Corolla",
        type: "Sedan",
        fuel: "Petrol",
        seats: 5,
        transmission: "Automatic",
        price: 20000,
        status: "Available",
    },
    {
        vehicleId: "V124",
        image: "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=2048:*",
        name: "Tesla Model S",
        type: "Sedan",
        fuel: "Electric",
        seats: 5,
        transmission: "Automatic",
        price: 75000,
        status: "Available",
    },
    {
        vehicleId: "V125",
        image: "https://media.ed.edmunds-media.com/audi/a4/2023/oem/2023_audi_a4_sedan_prestige-quattro_fq_oem_1_1600.jpg",
        name: "BMW i7",
        type: "Luxury Sedan",
        fuel: "Electric",
        seats: 5,
        transmission: "Automatic",
        price: 105000,
        status: "Available"
    },
    {
        vehicleId: "C001",
        image: "https://media.ed.edmunds-media.com/mercedes-benz/c-class/2023/oem/2023_mercedes-benz_c-class_sedan_amg-c-43_fq_oem_1_1600.jpg",
        name: "Mercedes-Benz C-Class",
        type: "Sedan",
        fuel: "Petrol",
        seats: 5,
        transmission: "Automatic",
        price: 55000,
        status: "Available"
    },
    {
        vehicleId: "C002",
        image: "https://parkers-images.bauersecure.com/wp-images/22027/cut-out/1200x800/062-audi-a6-review.jpg?mode=max&quality=90&scale=down",
        name: "Audi A6",
        type: "Sedan",
        fuel: "Petrol",
        seats: 5,
        transmission: "Automatic",
        price: 60000,
        status: "Available"
    },
    {
        vehicleId: "VAN001",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/2021_Toyota_HiAce_(GDH320R)_SLWB_van_%282021-11-12%29_01.jpg",
        name: "Toyota HiAce",
        type: "Van",
        fuel: "Diesel",
        seats: 12,
        transmission: "Manual",
        price: 45000,
        status: "Available"
    },
    {
        vehicleId: "VAN002",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/2020_Mercedes-Benz_Sprinter_314_CDI_LWB_Delivery_van_%282020-08-02%29_01.jpg",
        name: "Mercedes-Benz Sprinter",
        type: "Van",
        fuel: "Diesel",
        seats: 14,
        transmission: "Automatic",
        price: 60000,
        status: "Available"
    },

];

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
});

const VehiclePDF = ({ vehicle }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text>Vehicle Name: {vehicle.name}</Text>
                <Text>Type: {vehicle.type}</Text>
                <Text>Fuel: {vehicle.fuel}</Text>
                <Text>Seats: {vehicle.seats}</Text>
                <Text>Transmission: {vehicle.transmission}</Text>
                <Text>Price: ${vehicle.price}</Text>
                <Text>Status: {vehicle.status}</Text>
            </View>
        </Page>
    </Document>
);

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState(defaultVehicleDetails);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "" });


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

    const [newVehicle, setNewVehicle] = useState({
        vehicleId: "",
        image: "",
        name: "",
        type: "",
        fuel: "",
        seats: 1,
        transmission: "",
        price: 0,
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenUpdateDialog = (vehicle) => {
        setSelectedVehicle(vehicle);
        setUpdateDialogOpen(true);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedVehicle((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = () => {
        setVehicles((prevVehicles) =>
            prevVehicles.map((vehicle) =>
                vehicle.vehicleId === selectedVehicle.vehicleId ? selectedVehicle : vehicle
            )
        );
        setUpdateDialogOpen(false);
    };

    const handleAddVehicle = () => {
        if (vehicles.some((v) => v.vehicleId === newVehicle.vehicleId)) {
            alert("Vehicle ID already exists!");
            return;
        }

        setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);

        setNewVehicle({
            vehicleId: "",
            image: "",
            name: "",
            type: "",
            fuel: "",
            seats: 1,
            transmission: "",
            price: 0,
            status: "",
        });
    };

    const handleDeleteVehicle = (vehicleId) => {
        setVehicles(vehicles.filter((vehicle) => vehicle.vehicleId !== vehicleId));
    };

    const handleSubmit = () => {
        handleAddVehicle();
        setDialogOpen(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Available Vehicles
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                <Button variant="contained" onClick={() => setDialogOpen(true)}>
                    Add Vehicle
                </Button>
            </Box>
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
                        <Card>
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

                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                    <IconButton onClick={() => handleOpenUpdateDialog(vehicle)}>
                                        <FaEdit />
                                    </IconButton>
                                    <PDFDownloadLink
                                        document={<VehiclePDF vehicle={vehicle} />}
                                        fileName={`${vehicle.name}_details.pdf`}
                                    >
                                        <IconButton>
                                            <FaDownload />
                                        </IconButton>
                                    </PDFDownloadLink>
                                    <IconButton onClick={() => handleDeleteVehicle(vehicle.vehicleId)}>
                                        <FaTrash />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Vehicle Details</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        ["name", "image", "type", "fuel", "seats", "transmission", "price", "status"].map((field) => (
                            <TextField
                                key={field}
                                fullWidth
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                name={field}
                                value={selectedVehicle[field] || ""}
                                onChange={handleUpdateChange}
                                margin="dense"
                            />
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Vehicle ID" name="vehicleId" value={newVehicle.vehicleId} onChange={handleChange} />
                    <TextField fullWidth label="Image URL" name="image" value={newVehicle.image} onChange={handleChange} />
                    <TextField fullWidth label="Name" name="name" value={newVehicle.name} onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Add Vehicle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleDetails;
