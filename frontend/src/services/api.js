const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7202/api"; 

export const getTeams = async () => {
  const res = await fetch(`${BASE_URL}/team`);
  return res.json();
};

export const placeBid = async (data) => {
  const res = await fetch(`${BASE_URL}/bidding/place-bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getCurrentState = async (auctionId) => {
  const res = await fetch(`${BASE_URL}/bidding/current-state/${auctionId}`);
  return res.json();
};