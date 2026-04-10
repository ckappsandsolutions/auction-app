import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BlockIcon from "@mui/icons-material/Block";

import BidControls from "./BidControls";

export default function LiveAuctionPanel(props) {
  const {
    player,
    highestBid,
    highestBidder,
    timeLeft,
    teams,
    selectedTeam,
    setSelectedTeam,
    bidAmount,
    setBidAmount,
    handleBid,
    isSold
  } = props;

  return (
    <Card elevation={4} style={{ borderRadius: "16px" }}>
      <CardContent>

        {/* Header */}
        <Typography variant="h5" gutterBottom>
          Live Auction
        </Typography>

        {/* Timer */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <AccessTimeIcon
            style={{ color: timeLeft <= 5 ? "red" : "#1976d2" }}
          />
          <Typography
            variant="h4"
            style={{
              marginLeft: "5px",
              color: timeLeft <= 5 ? "red" : "#1976d2",
              fontWeight: "bold"
            }}
          >
            {timeLeft}s
          </Typography>
        </Box>

        <Divider style={{ margin: "15px 0" }} />

        {player ? (
          <>
            {/* Player Info */}
            <Typography variant="h6" align="center">
              {player.name}
            </Typography>

            <Typography align="center" color="textSecondary">
              {player.category}
            </Typography>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={1}
            >
              <CurrencyRupeeIcon fontSize="small" />
              <Typography>{player.basePrice}</Typography>
            </Box>

            <Divider style={{ margin: "15px 0" }} />

            {/* Highest Bid */}
            <Box textAlign="center">
              <Typography variant="subtitle1">Highest Bid</Typography>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <CurrencyRupeeIcon style={{ color: "#2e7d32" }} />
                <Typography
                  variant="h3"
                  style={{ color: "#2e7d32", fontWeight: "bold" }}
                >
                  {highestBid}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={1}
              >
                <EmojiEventsIcon fontSize="small" />
                <Typography style={{ marginLeft: "5px" }}>
                  {highestBidder || "N/A"}
                </Typography>
              </Box>
            </Box>

            <Divider style={{ margin: "15px 0" }} />

            {/* Bid Section */}
            {!isSold ? (
              <BidControls
                teams={teams}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                handleBid={handleBid}
              />
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <BlockIcon color="error" />
                <Typography color="error" style={{ marginLeft: "5px" }}>
                  Player Sold
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Typography align="center">No active player</Typography>
        )}

      </CardContent>
    </Card>
  );
}