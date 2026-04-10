const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7202";

//helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const loginUser = async ({ username, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
};

export const getTeams = async () => {
  const res = await fetch(`${BASE_URL}/api/team`, {
    headers: getAuthHeaders()
  });
  return res.json();
};

export const placeBid = async (data) => {
  const res = await fetch(`${BASE_URL}/api/bidding/place-bid`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getCurrentState = async (auctionId) => {
  const res = await fetch(`${BASE_URL}/api/bidding/current-state/${auctionId}`, {
    headers: getAuthHeaders()
  });
  return res.json();
};