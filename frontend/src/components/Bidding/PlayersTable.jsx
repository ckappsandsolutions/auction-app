import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box
} from "@mui/material";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function PlayersTable({ players, player }) {
  return (
    <Grid container spacing={2}>
      {players.map((p) => {
        const isActive = player && p.id === player.id;

        return (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card
              elevation={isActive ? 6 : 2}
              style={{
                borderRadius: "12px",
                border: isActive ? "2px solid #1976d2" : "1px solid #ddd",
                backgroundColor: isActive ? "#e3f2fd" : "white",
                transition: "0.3s"
              }}
            >
              <CardContent>

                {/* Name */}
                <Typography variant="h6">
                  {p.name}
                </Typography>

                {/* Category */}
                <Typography color="textSecondary">
                  {p.category}
                </Typography>

                {/* Price */}
                <Box display="flex" alignItems="center" mt={1}>
                  <CurrencyRupeeIcon fontSize="small" />
                  <Typography>{p.basePrice}</Typography>
                </Box>

                {/* Status */}
                <Chip
                  label={p.status}
                  color={
                    p.status === "Sold"
                      ? "error"
                      : p.status === "Active"
                      ? "success"
                      : "default"
                  }
                  style={{ marginTop: "10px" }}
                />

                {/* Active Player */}
                {isActive && (
                  <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                    style={{ color: "#1976d2", fontWeight: "bold" }}
                  >
                    <LocalFireDepartmentIcon fontSize="small" />
                    <Typography style={{ marginLeft: "5px" }}>
                      Currently Bidding
                    </Typography>
                  </Box>
                )}

              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}