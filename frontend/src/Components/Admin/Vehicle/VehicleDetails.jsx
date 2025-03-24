import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Pagination, CircularProgress, IconButton } from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import jsPDF from "jspdf";
import axios from "axios";

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterTransmission, setFilterTransmission] = useState("");
    const [filterFuel, setFilterFuel] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newVehicle, setNewVehicle] = useState({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:4000/vehicles');
                setVehicles(response.data);
                setFilteredVehicles(response.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        filterVehicles(e.target.value, filterType, filterTransmission, filterFuel);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        filterVehicles(search, filterType, filterTransmission, filterFuel);
    };

    const filterVehicles = (search, type, transmission, fuel) => {
        let filtered = vehicles.filter(vehicle =>
            vehicle.name.toLowerCase().includes(search.toLowerCase()) &&
            (type ? vehicle.type === type : true) &&
            (transmission ? vehicle.transmission === transmission : true) &&
            (fuel ? vehicle.fuel === fuel : true)
        );
        setFilteredVehicles(filtered);
    };

    const handleAddVehicle = async () => {
        // Validate form fields
        if (!newVehicle.name || !newVehicle.type || !newVehicle.fuel || !newVehicle.seats || !newVehicle.transmission || !newVehicle.price || !newVehicle.image) {
            alert("Please fill all fields!");
            return;
        }

        try {
            await axios.post('http://localhost:4000/vehicles', newVehicle);
            setOpenForm(false);
            setNewVehicle({ name: "", type: "", fuel: "", seats: "", transmission: "", price: "", image: "" });
            const response = await axios.get('http://localhost:4000/vehicles');
            setVehicles(response.data);
            setFilteredVehicles(response.data);
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("There was an error adding the vehicle!");
        }
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <TextField label="Search" variant="outlined" size="small" onChange={handleSearchChange} />
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenForm(true)}>Add Vehicle</Button>
            </div>

            <Grid container spacing={2}>
                {loading ? <CircularProgress /> : filteredVehicles.length > 0 ? filteredVehicles.map(vehicle => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.vehicleId}>
                        <Card>
                            <CardMedia component="img" height="140" image={vehicle.image} alt={vehicle.name} />
                            <CardContent>
                                <Typography variant="h6">{vehicle.name}</Typography>
                                <Typography>{vehicle.type} - {vehicle.transmission}</Typography>
                                <Typography>Status: {vehicle.status}</Typography>
                                <Button onClick={() => handleDownloadPDF(vehicle)} variant="contained" size="small">Download PDF</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : <Typography>No Vehicles Found</Typography>}
            </Grid>

            <Dialog open={openForm} onClose={() => setOpenForm(false)}>
                <DialogTitle>Add Vehicle</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })} />
                    <TextField label="Type" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })} />
                    <TextField label="Fuel" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, fuel: e.target.value })} />
                    <TextField label="Seats" fullWidth type="number" onChange={(e) => setNewVehicle({ ...newVehicle, seats: e.target.value })} />
                    <TextField label="Transmission" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })} />
                    <TextField label="Price" fullWidth type="number" onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })} />
                    <TextField label="Image URL" fullWidth onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                    <Button onClick={handleAddVehicle} variant="contained" color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default VehicleDetails;