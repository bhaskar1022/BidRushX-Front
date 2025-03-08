import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Button, Form, Badge, Row, Col } from "react-bootstrap";

function CountdownTimer({ closingTime }) {
    const [timeLeft, setTimeLeft] = useState("Calculating...");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const endTime = new Date(closingTime);
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft("Bidding Closed");
                clearInterval(interval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [closingTime]);

    return (
        <p className="fw-bold mt-2" style={{ fontSize: "1.2rem", color: "#FF4500", background: "#FFF3E0", padding: "8px", borderRadius: "8px", display: "inline-block" }}>
            ⏳ <strong>Time Left:</strong> {timeLeft}
        </p>
    );
}

function AuctionItemDetails({ item, onBack }) {
    const [bidAmount, setBidAmount] = useState("");

    const handleBid = async () => {
        if (!bidAmount.trim()) {
            toast.error("Please enter a bid amount.");
            return;
        }

        const bidValue = Number(bidAmount);

        if (isNaN(bidValue) || bidValue <= item.currentBid) {
            toast.error("Enter a valid bid higher than the current bid!");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/bid/${item._id}`,
                { bid: bidValue },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );

            toast.success(response.data.message || "Bid placed successfully!");
            setBidAmount(""); // Clear input field after success
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to place bid.";
            console.error("Error placing bid:", errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" >
            <Card className="shadow-lg p-5 text-center" style={{ width: "450px", backgroundColor: "#fff", borderRadius: "15px" }}>
                <Card.Body>
                    <h2 className="text-primary fw-bold">{item.itemName}</h2>
                    <Badge bg={new Date(item.closingTime) < new Date() ? "danger" : "success"}>
                        {new Date(item.closingTime) < new Date() ? "Closed" : "Active"}
                    </Badge>
                    <p className="text-muted mt-2">{item.description}</p>
                    <p className="fw-bold">Current Bid: ${item.currentBid}</p>
                    <p className="fw-semibold">End Time: {new Date(item.closingTime).toLocaleString()}</p>
                    <CountdownTimer closingTime={item.closingTime} />

                    {new Date(item.closingTime) > new Date() ? (
                        <>
                            <Form className="mt-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Enter bid amount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                />
                            </Form>
                            <Button
                                style={{ backgroundColor: "#ff4081", color: "white", fontWeight: "bold", borderRadius: "8px" }}
                                className="mt-3 w-100"
                                onClick={handleBid}
                                disabled={!bidAmount.trim() || Number(bidAmount) <= item.currentBid}
                            >
                                Place Bid
                            </Button>
                        </>
                    ) : (
                        <p className="text-danger mt-3">Bidding is closed for this item.</p>
                    )}

                    <Button variant="warning" className="mt-3 w-100" onClick={onBack}>
                        Back to Auction Items
                    </Button>
                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
}

export default AuctionItemDetails;
