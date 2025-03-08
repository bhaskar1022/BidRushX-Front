import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button, Card } from "react-bootstrap";

function AddAuctionItem() {
    const [item, setItem] = useState({
        itemName: "",
        description: "",
        startingBid: "",
        closingTime: ""
    });

    const [darkMode, setDarkMode] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!item.itemName || !item.description || !item.startingBid || !item.closingTime) {
            toast.error("All fields are required!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/auctions", item, {
                headers: { 
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, 
                    "Content-Type": "application/json"
                }
            });

            toast.success("Item added successfully!");
            setItem({ itemName: "", description: "", startingBid: "", closingTime: "" });

        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            toast.error("Failed to add item.");
        }
    };

    return (
        <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'bg-dark text-white' : ''}`}> 
            <Card className="shadow-lg p-5 text-center" style={{ width: "450px", backgroundColor: darkMode ? "#333" : "#fff", borderRadius: "15px", color: darkMode ? "white" : "black" }}>
                <Card.Body>
                    <h2 className="text-primary fw-bold">Add a New Auction Item</h2>
                    <p className="text-muted">Fill in the details to list your item!</p>
                    <Form onSubmit={handleSubmit} className="text-start">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Item Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter item name" 
                                value={item.itemName} 
                                onChange={(e) => setItem({ ...item, itemName: e.target.value })} 
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter item description" 
                                value={item.description} 
                                onChange={(e) => setItem({ ...item, description: e.target.value })} 
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Starting Bid</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter starting bid" 
                                value={item.startingBid} 
                                onChange={(e) => setItem({ ...item, startingBid: e.target.value })} 
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Closing Time</Form.Label>
                            <Form.Control 
                                type="datetime-local" 
                                value={item.closingTime} 
                                onChange={(e) => setItem({ ...item, closingTime: e.target.value })} 
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100 py-2 mb-3" style={{ backgroundColor: "#ff4081", color: "white", fontWeight: "bold", borderRadius: "8px" }}>
                            Add Item
                        </Button>

                        <Button onClick={() => setDarkMode(!darkMode)} className="w-100 py-2" style={{ backgroundColor: darkMode ? "#f1c40f" : "#2c3e50", color: "white", fontWeight: "bold", borderRadius: "8px" }}>
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
}

export default AddAuctionItem;
