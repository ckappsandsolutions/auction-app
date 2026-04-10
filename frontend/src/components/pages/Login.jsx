import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment
} from "@mui/material";

import { toast } from "react-toastify";
import { Icons } from "../../common/icons";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const ShowIcon = Icons.show;
  const HideIcon = Icons.hide;

  const validate = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const res = await login(username, password);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Login successful");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)"
      }}
    >
      {/* LEFT */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          p: 5
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Auction Platform
        </Typography>
        <Typography sx={{ mt: 2, opacity: 0.8 }}>
          Welcome back! Please login to your account to continue.
        </Typography>
      </Grid>

      {/* RIGHT */}
      <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
        <Box
          sx={{
            width: "80%",
            maxWidth: "400px",
            p: 4,
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            color: "white"
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            error={!!errors.username}
            helperText={errors.username}
            InputLabelProps={{ style: { color: "#ddd" } }}
            sx={{ input: { color: "white" } }}
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            InputLabelProps={{ style: { color: "#ddd" } }}
            sx={{ input: { color: "white" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <HideIcon /> : <ShowIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              background: "rgba(255,255,255,0.2)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)"
              }
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography
            align="center"
            sx={{ mt: 2, cursor: "pointer", opacity: 0.8 }}
            onClick={() => (window.location.href = "/register")}
          >
            Don't have an account? Register
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}