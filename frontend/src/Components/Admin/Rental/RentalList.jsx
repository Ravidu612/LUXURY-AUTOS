// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box, Typography, Button } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faDollarSign, faSackDollar, faHammer, faSignOutAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';


const drawerWidth = 230;

// Sidebar Background with overlay
const sidebarBackground = 'path_to_image'; // Replace with actual image URL or import statement


const menuItems = [
  { text: 'Main Dashboard', icon: faTachometerAlt, path: '/admindashboard/dashboard' },
  { text: 'Rental Records', icon: faSackDollar, path: '/rental-management/RentalList' },
  { text: 'Payments & Receipts', icon: faUsers, path: '/rental-management/payments&receipts' },
  { text: 'Contracts & Agreements', icon: faBuilding, path: '/rental-management/ContractsAndAgreements' },
  { text: 'Financial Transactions', icon: faSackDollar, path: '/rental-management/financialtransaction' },
  { text: 'Transaction Status', icon: faHammer, path: '/rental-management/TransactionStatus' },
];



function RentalDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState('');

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setCurrentTab(currentItem.text);
    }
  }, [location.pathname]);

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar Navigation */}
      <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${sidebarBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        color: 'white',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => handleMenuClick(item.path)} >
              <ListItemIcon>
                <FontAwesomeIcon icon={item.icon} style={{ color: ' #ff932f' }} /> {/* Orange icons */} </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: 'black' }} />
            </ListItem>
          ))}
        </List>

      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f4f4f4', // Light background
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Header Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to left, #babd02, #ff932f)',
            padding: '15px 30px',
            color: 'white',
            height: '80px'
          }}
        >
          <Typography variant="h5">{currentTab}</Typography>

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: '#ff3b3b',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' },
              padding: '8px 16px'
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </Button>
        </Box>

<Outlet />
      </Box>
    </Box>
  );
}

export default RentalDashboard;