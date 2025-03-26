import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  CircularProgress,
} from "@mui/material";
import Footer from "../Footer/Footer";
import Header from "../Navbar/Navbar";
import axios from "axios";

const VehiclePage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterTransmission, setFilterTransmission] = useState("");
  const [filterFuel, setFilterFuel] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:4000/vehicles");
        setVehicles(response.data);
        setFilteredVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        alert("Failed to fetch vehicle data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterVehicles(value, filterType, filterTransmission, filterFuel);
  };

  const handleFilterChange = (setter, filterKey) => (e) => {
    const value = e.target.value;
    setter(value);

    const updatedFilters = {
      search,
      type: filterKey === "type" ? value : filterType,
      transmission: filterKey === "transmission" ? value : filterTransmission,
      fuel: filterKey === "fuel" ? value : filterFuel,
    };

    filterVehicles(updatedFilters.search, updatedFilters.type, updatedFilters.transmission, updatedFilters.fuel);
  };

  const filterVehicles = (search, type, transmission, fuel) => {
    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(search.toLowerCase()) &&
        (type ? vehicle.type === type : true) &&
        (transmission ? vehicle.transmission === transmission : true) &&
        (fuel ? vehicle.fuel === fuel : true)
    );
    setFilteredVehicles(filtered);
  };

  const handleBookNow = (vehicle) => {
    navigate(`/booknow`, { state: { vehicle } });
  };

  const handleCardClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseDialog = () => {
    setSelectedVehicle(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Container style={{ flex: 1 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
          style={{ marginBottom: "20px" }}
        />
        <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={4}>
            <Select
              value={filterType}
              onChange={handleFilterChange(setFilterType, "type")}
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
              onChange={handleFilterChange(setFilterTransmission, "transmission")}
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
              onChange={handleFilterChange(setFilterFuel, "fuel")}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">All Fuels</MenuItem>
              <MenuItem value="Petrol">Petrol</MenuItem>
              <MenuItem value="Diesel">Diesel</MenuItem>
            </Select>
          </Grid>
        </Grid>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {filteredVehicles.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                <Card
                  style={{
                    borderRadius: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                  }}
                  onClick={() => handleCardClick(vehicle)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehicle.image}
                    alt={vehicle.name}
                    style={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                      {vehicle.name}
                    </Typography>
                    <Typography style={{ margin: "10px 0" }}>
                      {/* Additional details can go here */}
                    </Typography>
                    <Typography style={{ fontWeight: "bold", color: "#333" }}>
                      {vehicle.price} USD
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(vehicle);
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
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
      </Container>
      <Footer />
    </div>
  );
};

export default VehiclePage;