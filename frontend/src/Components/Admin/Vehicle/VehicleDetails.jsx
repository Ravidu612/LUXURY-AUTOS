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
    IconButton,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
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

            <Grid container spacing={3} justifyContent="center">
                {vehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.vehicleId}>
                        <Card sx={{ maxWidth: 345 }}>
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
                                    <PDFDownloadLink
                                        document={<VehiclePDF vehicle={vehicle} />}
                                        fileName={`${vehicle.name}.pdf`}
                                    >
                                        {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
                                    </PDFDownloadLink>
                                    <Box>
                                        <IconButton onClick={() => handleOpenUpdateDialog(vehicle)}>
                                            <FaEdit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteVehicle(vehicle.vehicleId)}>
                                            <FaTrash />
                                        </IconButton>
                                    </Box>
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
        </Box>
    );
};

export default VehicleDetails;
