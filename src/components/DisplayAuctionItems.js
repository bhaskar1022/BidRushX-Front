import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AuctionItemDetails from "./AuctionItemDetails";
import { Card, Button, Badge, Form, Row, Col, Spinner } from "react-bootstrap";

function DisplayAuctionItems() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/auctions");
                const sortedItems = response.data.sort((a, b) => new Date(a.closingTime) - new Date(b.closingTime));

                if (isMounted) {
                    setItems(sortedItems);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching auction items:", error);
                setLoading(false);
            }
        };

        fetchData();
        const refreshTimeout = setTimeout(fetchData, 30000);

        return () => {
            isMounted = false;
            clearTimeout(refreshTimeout);
        };
    }, []);

    const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const isActive = new Date(item.closingTime) > new Date();
            const matchesSearch = item?.itemName?.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterStatus === "active" && !isActive) return false;
            if (filterStatus === "closed" && isActive) return false;

            return matchesSearch;
        });
    }, [items, searchTerm, filterStatus]);

    if (selectedItem) {
        return <AuctionItemDetails item={selectedItem} onBack={() => setSelectedItem(null)} />;
    }

    return (
        <>
            <Row className="mt-4 mx-auto" style={{ maxWidth: "1000px" }}>
                <Col md={6}>
                    <Form.Control 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center mt-4">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading auctions...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <p className="text-center mt-4">No auctions found.</p>
            ) : (
                <Row className="mt-3 mx-auto">
                    {filteredItems.map((item) => {
                        const isActive = new Date(item.closingTime) > new Date();
                        return (
                            <Col md={4} key={item._id} className="mb-3">
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <Card.Title>{item.itemName}</Card.Title>
                                        <Badge bg={isActive ? "success" : "danger"} className="mb-2">
                                            {isActive ? "Active" : "Closed"}
                                        </Badge>

                                        <Card.Text>
                                            <strong>Current Bid:</strong> ${item.currentBid}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Closing Time:</strong> {formatDateTime(item.closingTime)}
                                        </Card.Text>
                                        <Button 
                                            style={{ backgroundColor: "rgb(242, 7, 109)" }}
                                            className="mt-2 w-100"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            View Details
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </>
    );
}

export default DisplayAuctionItems;
