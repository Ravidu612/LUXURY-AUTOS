import React, { useState } from 'react';
import { Button, Container, Typography, Grid, Box, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Paper, List as MuiList, ListItem, ListItemText, IconButton } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { RentalData } from '../Database/Data';

function Rental() {
    const [rentals, setRentals] = useState(RentalData);
    const [openDialog, setOpenDialog] = useState(false);
    const [openModifyDialog, setOpenModifyDialog] = useState(false);
    const [openNewTransactionDialog, setOpenNewTransactionDialog] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredRentals = rentals.filter((rental) =>
        rental.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterStatus === "All" || rental.status === filterStatus)
    );

    // State for new rental form
    const [newRental, setNewRental] = useState({
        name: "",
        location: "",
        price: "",
        status: "Active",
    });

    const handleOpenNewTransaction = () => {
        setOpenNewTransactionDialog(true);
    };

    const handleCloseNewTransaction = () => {
        setOpenNewTransactionDialog(false);
        setNewRental({ name: "", location: "", price: "", status: "Active" });
    };

    const handleSaveNewTransaction = () => {
        if (!newRental.name || !newRental.location || !newRental.price) {
            alert("Please fill in all fields!");
            return;
        }

        const newRentalItem = {
            id: rentals.length + 1,
            ...newRental,
            price: `$${newRental.price}`,
        };

        setRentals([...rentals, newRentalItem]);
        handleCloseNewTransaction();
    };

    const handleViewTransaction = (rental) => {
        setSelectedRental(rental);
        setOpenDialog(true);
    };

    const handleModifyPayment = (rental) => {
        setSelectedRental(rental);
        setOpenModifyDialog(true);
    };

    const handleArchiveTransaction = (id) => {
        setRentals(rentals.map((rental) => (rental.id === id ? { ...rental, status: "Archived" } : rental)));
    };

    const handleUnarchiveTransaction = (id) => {
        setRentals(rentals.map((rental) => (rental.id === id ? { ...rental, status: "Active" } : rental)));
    };

    return (
        <div style={{ padding: "10px", backgroundColor: "rgb(253, 253, 227)", minHeight: "100vh" }}>
            <Container>
                <Box textAlign="left" my={4}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ px: 3, py: 1, borderRadius: 2, fontSize: "1rem", mx: 2, my: 1 }}
                        onClick={handleOpenNewTransaction}
                    >
                        Add Rental
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{ px: 3, py: 1, borderRadius: 2, fontSize: "1rem", mx: 2, my: 1 }}
                        onClick={() => setFilterStatus('Archived')}
                    >
                        View Archive
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ px: 3, py: 1, borderRadius: 2, fontSize: "1rem", mx: 2, my: 1 }}
                        onClick={() => setFilterStatus('All')}
                    >
                        View All
                    </Button>
                
                    <TextField
                        marginRight={2}
                        variant="outlined"
                        placeholder="Search Rental... "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                        }}
                        sx={{ mx: 2, my: 1 }}
                    />
                    <TextField
                        select
                        variant="outlined"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{ mx: 2, my: 1 }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Archived">Archived</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                    </TextField>
                </Box>
                <MuiList sx={{ width: "100%", maxWidth: 800, margin: "auto" }}>
                    {filteredRentals.map((rental) => (
                        <Paper
                            key={rental.id}
                            elevation={4}
                            sx={{
                                margin: "12px 0",
                                padding: 2,
                                borderRadius: 3,
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": { transform: "scale(1.02)" }
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                {/* Rental Details */}
                                <Grid item xs={12} sm={8}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="bold" color="info">
                                                {rental.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    variant="body2"
                                                    color={rental.status === "Active" ? "success.main" : rental.status === "Completed" ? "info.main" : rental.status === "Archived" ? "warning.main" : rental.status === "Pending" ? "error.main" : "textSecondary"}
                                                    fontWeight="bold"
                                                >
                                                    🔹 Status: {rental.status}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12} sm={4}>
                                    <Box display="flex" justifyContent={{ xs: "center", sm: "flex-end" }} gap={1} flexWrap="wrap">
                                        <IconButton color="primary" size="medium" onClick={() => handleViewTransaction(rental)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="secondary" size="medium" onClick={() => handleModifyPayment(rental)}>
                                            <EditIcon />
                                        </IconButton>
                                        {rental.status !== "Archived" && (
                                            <IconButton color="warning" size="medium" onClick={() => handleArchiveTransaction(rental.id)}>
                                                <ArchiveIcon />
                                            </IconButton>
                                        )}
                                        {rental.status === "Archived" && (
                                            <IconButton color="success" size="medium" onClick={() => handleUnarchiveTransaction(rental.id)}>
                                                <UnarchiveIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </MuiList>

                {/* New Rental Dialog */}
                <Dialog open={openNewTransactionDialog} onClose={handleCloseNewTransaction}>
                    <DialogTitle>New Rental</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Name"
                            value={newRental.name}
                            onChange={(e) => setNewRental({ ...newRental, name: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Location"
                            value={newRental.location}
                            onChange={(e) => setNewRental({ ...newRental, location: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={newRental.price}
                            onChange={(e) => setNewRental({ ...newRental, price: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseNewTransaction} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNewTransaction} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* View Rental Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} >
                    <DialogTitle>Rental Details</DialogTitle>
                    <DialogContent>
                        {selectedRental && (
                            <>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">📍 Location: {selectedRental.location}</Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">💲 Price: {selectedRental.price}</Typography>
                                <Typography
                                    variant="body2"
                                    color={selectedRental.status === "Active" ? "success.main" : "textSecondary"}
                                    fontWeight="bold"
                                >
                                    🔹 Status: {selectedRental.status}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold"> 🔹 Property: {selectedRental.propertyID}</Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold"> 🔹 Tenant: {selectedRental.tenantID}</Typography>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold"> 🔹 Landlord: {selectedRental.landlordID}</Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modify Rental Dialog */}
                <Dialog open={openModifyDialog} onClose={() => setOpenModifyDialog(false)}>
                    <DialogTitle>Modify Rental Details</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Name"
                            value={selectedRental?.name || ''}
                            onChange={(e) => setSelectedRental({ ...selectedRental, name: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Location"
                            value={selectedRental?.location || ''}
                            onChange={(e) => setSelectedRental({ ...selectedRental, location: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            value={selectedRental?.price || ''}
                            onChange={(e) => setSelectedRental({ ...selectedRental, price: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Status"
                            value={selectedRental?.status || ''}
                            onChange={(e) => setSelectedRental({ ...selectedRental, status: e.target.value })}
                            margin="dense"
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModifyDialog(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                setRentals(rentals.map((rental) => (rental.id === selectedRental.id ? selectedRental : rental)));
                                setOpenModifyDialog(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}

export default Rental;
