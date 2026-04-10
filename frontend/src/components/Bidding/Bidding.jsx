import React, { useEffect, useState } from "react";
import { getTeams, placeBid, getCurrentState } from "../../services/api";
import { startConnection } from "../../services/signalr";

import AuctionLayout from "../layouts/AuctionLayout";
import PlayersTable from "./PlayersTable";
import LiveAuctionPanel from "./LiveAuctionPanel";
import { toast } from "react-toastify";


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

    const auctionId = "a70c8ade-bf22-47ee-9fb1-f508981a8805";

    useEffect(() => {
        loadTeams();
        loadState();

        startConnection(auctionId, (type, data) => {
            switch (type) {
                case "bidUpdate":
                    if (data.bidAmount) setHighestBid(data.bidAmount);
                    if (data.endTime) setEndTime(new Date(data.endTime));
                    break;

                case "playerSold":
                    toast.success(`SOLD for ₹${data.amount}`);
                    setIsSold(true);
                    break;

                case "newPlayer":
                    setIsSold(false);
                    setHighestBid(0);
                    setEndTime(new Date(data.endTime));
                    break;

                case "auctionCompleted":
                    toast.info("Auction Finished");
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
            toast.error("Please fill all fields");
            return;
        }

        const res = await placeBid({
            auctionId,
            playerId: player.id,
            teamId: selectedTeam,
            bidAmount: Number(bidAmount)
        });
        
        toast.success(res.message);
        loadState();
    };

    return (
        <AuctionLayout>
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <LiveAuctionPanel
                        player={player}
                        highestBid={highestBid}
                        highestBidder={highestBidder}
                        timeLeft={timeLeft}
                        teams={teams}
                        selectedTeam={selectedTeam}
                        setSelectedTeam={setSelectedTeam}
                        bidAmount={bidAmount}
                        setBidAmount={setBidAmount}
                        handleBid={handleBid}
                        isSold={isSold}
                    />
                </div>
                <div style={{ flex: 2 }}>
                    <PlayersTable players={players} player={player} />
                </div>
            </div>
        </AuctionLayout>
    );
};

export default Bidding;