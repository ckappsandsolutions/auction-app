import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // TEMP username (later from token / API)
  const username = localStorage.getItem("username") || "User";

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    handleClose();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>

        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", mr: 3 }}
          onClick={() => navigate("/")}
        >
          Auction App
        </Typography>

        {/* Navigation */}
        <Box display="flex" gap="10px">
          <Button color="inherit" onClick={() => navigate("/today")}>
            Today's Auction
          </Button>

          <Button color="inherit" onClick={() => navigate("/upcoming")}>
            Upcoming Auction
          </Button>

          <Button color="inherit" onClick={() => navigate("/prices")}>
            Prices
          </Button>

          <Button color="inherit" onClick={() => navigate("/clients")}>
            Clients
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section */}
        {token ? (
          <>
            {/* Avatar + Username */}
            <Box
              display="flex"
              alignItems="center"
              gap="10px"
              sx={{ cursor: "pointer" }}
              onClick={handleMenuOpen}
            >
              <Avatar>
                {username.charAt(0).toUpperCase()}
              </Avatar>

              <Typography>{username}</Typography>
            </Box>

            {/* Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>
                Profile
              </MenuItem>

              <MenuItem onClick={() => { handleClose(); navigate("/dashboard"); }}>
                Dashboard
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box display="flex" gap="10px">
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        )}

      </Toolbar>
    </AppBar>
  );
}