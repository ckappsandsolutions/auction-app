import * as signalR from "@microsoft/signalr";

let connection = null;
let startPromise = null;
let BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7202"; 

export const startConnection = async (auctionId, onEvent) => {
    //If already connected do nothing
    if (connection && connection.state === "Connected") return;

    //If connection is in progress wait for it
    if (startPromise) {
        await startPromise;
        return;
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/auctionHub`)
        .withAutomaticReconnect()
        .build();


    connection.on("ReceiveBidUpdate", (data) => {
        onEvent("bidUpdate", data);
    });

    connection.on("PlayerSold", (data) => {
        onEvent("playerSold", data);
    });

    connection.on("NewPlayerStarted", (data) => {
        onEvent("newPlayer", data);
    });

    connection.on("AuctionCompleted", (data) => {
        onEvent("auctionCompleted", data);
    });

    connection.onreconnected(async () => {
        console.log("Reconnected");
        await connection.invoke("JoinAuction", auctionId);
    });

    //Store promise to avoid duplicate starts
    startPromise = connection.start();

    try {
        await startPromise;

        console.log("SignalR Connected");

        await connection.invoke("JoinAuction", auctionId);
    } catch (err) {
        console.error("SignalR error:", err);
    } finally {
        startPromise = null; // reset after done
    }
};