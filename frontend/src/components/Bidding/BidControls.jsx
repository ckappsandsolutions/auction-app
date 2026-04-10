import { Select, MenuItem, Button, TextField } from "@mui/material";

export default function BidControls({
  teams,
  selectedTeam,
  setSelectedTeam,
  bidAmount,
  setBidAmount,
  handleBid
}) {
  return (
    <>
      <Select
        fullWidth
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        style={{ marginTop: "10px" }}
      >
        <MenuItem value="">Select Team</MenuItem>
        {teams.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name}
          </MenuItem>
        ))}
      </Select>

      <TextField
        fullWidth
        type="number"
        placeholder="Enter bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        style={{ marginTop: "10px" }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleBid}
        style={{ marginTop: "10px" }}
      >
        Place Bid
      </Button>
    </>
  );
}