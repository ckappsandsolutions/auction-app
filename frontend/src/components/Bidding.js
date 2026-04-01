import React, { useEffect, useState } from "react";
import { getTeams, placeBid, getCurrentState } from "../services/api";
import { startConnection } from "../services/signalr";

const Bidding = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [bidAmount, setBidAmount] = useState("");

    const [player, setPlayer] = useState(null);
    const [players, setPlayers] = useState([]);
    const [highestBid, setHighestBid] = useState(0);
    const [highestBidder, setHighestBidder] = useState("");
    const [endTime, setEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSold, setIsSold] = useState(false);

    const auctionId = "a70c8ade-bf22-47ee-9fb1-f508981a8805"; // hardcoded for now

    useEffect(() => {
        loadTeams();
        loadState();


        startConnection(auctionId, (type, data) => {

            switch (type) {
                case "bidUpdate":
                    if (data.bidAmount) {
                        setHighestBid(data.bidAmount);
                    }
                    if (data.endTime) {
                        setEndTime(new Date(data.endTime));
                    }
                    break;

                case "playerSold":
                    alert(`SOLD for ₹${data.amount}`);
                    setIsSold(true);
                    break;

                case "newPlayer":
                    setIsSold(false);
                    setHighestBid(0);
                    setEndTime(new Date(data.endTime));
                    // later: update player details
                    break;

                case "auctionCompleted":
                    alert("Auction Finished");
                    break;

                default:
                    break;
            }

        });


    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (endTime) {
                const diff = Math.max(0, Math.floor((endTime - new Date()) / 1000));
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const loadTeams = async () => {
        const data = await getTeams();
        setTeams(data);
    };

    const loadState = async () => {
        const data = await getCurrentState(auctionId);

        if (data.player) {
            setPlayer(data.player);
            setHighestBid(data.highestBid);
            setHighestBidder(data.highestBidder);
        }
        if (data.players) {
            setPlayers(data.players);
        }
        if (data.endTime) {
            setEndTime(new Date(data.endTime));
        }
    };

    const handleBid = async () => {
        if (!selectedTeam || !bidAmount || !player) {
            alert("Fill all fields");
            return;
        }

        const res = await placeBid({
            auctionId,
            playerId: player.id,
            teamId: selectedTeam,
            bidAmount: Number(bidAmount)
        });

        alert(res.message || JSON.stringify(res));
        loadState(); // refresh after bid
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3>All Players</h3>
            <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Base Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((p) => (
                        <tr
                            key={p.id}
                            style={{
                                backgroundColor:
                                    player && p.id === player.id ? "white" : "white"
                            }}
                        >
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>₹{p.basePrice}</td>
                            <td>{p.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Live Auction</h2>

            <h2 style={{ color: timeLeft <= 5 ? "red" : "black" }}>
                Time Left: {timeLeft}s
            </h2>

            {player ? (
                <>
                    <h3>{player.name}</h3>
                    <p>Category: {player.category}</p>
                    <p>Base Price: ₹{player.basePrice}</p>
                    <p>Status: {player.status}</p>
                    <hr />

                    <h3>Highest Bid: ₹{highestBid}</h3>
                    <p>Leading: {highestBidder}</p>

                    <hr />

                    <div>
                        <select onChange={(e) => setSelectedTeam(e.target.value)}>
                            <option value="">Select Team</option>
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!isSold && (
                        <>
                            <input
                                type="number"
                                placeholder="Enter bid"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                            />
                            <button onClick={handleBid}>Place Bid</button>
                        </>
                    )}
                </>
            ) : (
                <p>No active player</p>
            )}
        </div>
    );
};

export default Bidding;