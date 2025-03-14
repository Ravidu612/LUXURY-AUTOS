import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GetAppIcon from '@mui/icons-material/GetApp';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddInventory from './AddInventory';
import AnalysisView from './AnalysisView';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import * as XLSX from 'xlsx';

const URL = "http://localhost:4000/inventory";

const fetchInventory = async () => {
  try {
    const response = await axios.get(URL);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

function InventoryDetails() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchInventory();
        setInventory(data);
        setNoResults(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      if (debouncedSearchQuery.trim() === "") {
        fetchInventory().then(data => {
          setInventory(data);
          setNoResults(false);
        }).catch(error => {
          console.error("Error fetching inventory:", error);
        });
        return;
      }

      const filteredInventory = inventory.filter(item =>
        Object.values(item).some(field =>
          field && field.toString().toLowerCase().startsWith(debouncedSearchQuery.toLowerCase())
        )
      );
      setInventory(filteredInventory);
      setNoResults(filteredInventory.length === 0);
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  const handleEdit = (id) => {
    navigate(`/admindashboard/update-inventory/${id}`);
  };

  const deleteInventory = async (id) => {
    try {
      console.log(`Attempting to delete item with ID: ${id}`);
      const response = await axios.delete(`${URL}/${id}`);
      if (response.status === 200) {
        setInventory(prev => prev.filter(item => item._id !== id));
        setSnackbarMessage('Item deleted successfully!');
        setSnackbarSeverity('success');
      } else {
        console.error("Unexpected response status:", response.status);
        setSnackbarMessage('Error deleting item.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error("Error deleting item:", error.response ? error.response.data : error.message);
      setSnackbarMessage('Error deleting item.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${URL}/${id}`)));
      setInventory(prev => prev.filter(item => !selectedIds.includes(item._id)));
      setSelectedIds([]);
      setSnackbarMessage('Selected items deleted successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error("Error deleting items:", error.response ? error.response.data : error.message);
      setSnackbarMessage('Error deleting items.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Skylight Cinema", 10, 10);
    doc.setFontSize(14);
    doc.text("Maintenance Details Report", 10, 20);
    doc.autoTable({
      head: [['ID', 'Item Name', 'Type', 'Maintenance ID', 'Cost', 'Date', 'Note']],
      body: inventory.map(item => [
        item.InvID,
        item.ItemName,
        item.type,
        item.MaintananceID,
        item.Cost,
        new Date(item.Date).toLocaleDateString(),
        item.Note || 'No Note'
      ]),
      startY: 30,
      margin: { top: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
      },
      headStyles: {
        fillColor: [0, 0, 128], // Dark blue
        textColor: [255, 255, 255], // White
      },
    });
    doc.save('Skylight_Cinema_Maintenance_Details.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventory.map(item => ({
      ID: item.InvID,
      'Item Name': item.ItemName,
      Type: item.type,
      'Maintenance ID': item.MaintananceID,
      Cost: item.Cost,
      Date: new Date(item.Date).toLocaleDateString(),
      Note: item.Note || 'No Note',
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // Save to file
    XLSX.writeFile(workbook, 'inventory_report.xlsx');
  };

  const handleAddInventory = () => {
    setShowAddInventoryForm(true);
  };

  const handleBack = () => {
    setShowAddInventoryForm(false);
  };

  const handleShowAnalysis = () => {
    setShowAnalysisView(true);
  };

  const handleSelectItem = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleStatus = (id) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item._id === id ? { ...item, status: item.status === 'Pending' ? 'Complete' : 'Pending' } : item
      )
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#e0f7fa', borderRadius: 2 }}>
      {showAddInventoryForm ? (
        <AddInventory onBack={handleBack} />
      ) : showAnalysisView ? (
        <AnalysisView inventory={inventory} onBack={() => setShowAnalysisView(false)} />
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexShrink: 1,
                width: '300px',
                backgroundColor: '#ffffff',
                borderRadius: 1,
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddInventory}
              sx={{
                borderRadius: 2,
                '&:hover': { backgroundColor: '#c2185b' }, // Darker pink
                backgroundColor: '#e91e63', // Pink
              }}
              startIcon={<Add />}
            >
              Add Maintenance
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
              sx={{
                borderRadius: 2,
                '&:hover': { backgroundColor: '#d32f2f' }, // Darker red
                backgroundColor: '#f44336', // Red
              }}
              disabled={selectedIds.length === 0}
            >
              Delete Selected
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleShowAnalysis}
              sx={{
                borderRadius: 2,
                '&:hover': { backgroundColor: '#1976d2' }, // Darker blue
                backgroundColor: '#2196f3', // Blue
              }}
            >
              Show Analysis
            </Button>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff', borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(inventory.map(item => item._id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        checked={selectedIds.length === inventory.length && inventory.length > 0}
                      />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Maintenance ID</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                    <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: '#f1f8e9' } }}>
                      <TableCell padding="checkbox">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleSelectItem(item._id)}
                        />
                      </TableCell>
                      <TableCell>{item.InvID}</TableCell>
                      <TableCell>{item.ItemName}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.MaintananceID}</TableCell>
                      <TableCell>{item.Cost}</TableCell>
                      <TableCell>{new Date(item.Date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.Note || 'No Note'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item._id)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => deleteInventory(item._id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => toggleStatus(item._id)}>
                          {item.status === 'Pending' ? 'Complete' : 'Pending'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {noResults && !loading && (
            <Typography variant="h6" color="error">No results found.</Typography>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={inventory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Box for buttons at the bottom left */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={exportToExcel}
              sx={{ borderRadius: 2, mr: 1, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
              startIcon={<GetAppIcon />}
            >
              Export to Excel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handlePDF}
              sx={{ borderRadius: 2, backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' } }}
              startIcon={<PictureAsPdfIcon />}
            >
              Print PDF
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InventoryDetails;
