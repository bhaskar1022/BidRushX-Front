import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DisplayAuctionItems from "../components/DisplayAuctionItems";
import AddAuctionItem from "../components/AddAuctionItem";
import { FaGavel, FaPlus, FaSignOutAlt, FaBars, FaClipboardList, FaMoon, FaSun } from "react-icons/fa";
import { Navbar, Button } from "react-bootstrap";

function Dashboard() {
    const navigate = useNavigate();
    const [isItems, setIsItems] = useState(true);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
    const [activeTab, setActiveTab] = useState("items");
    const [darkMode, setDarkMode] = useState(false);

    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    // Handle Sidebar Navigation
    const handleTabChange = (tab) => {
        setIsItems(tab === "items");
        setActiveTab(tab);
        if (window.innerWidth <= 768) setShowSidebar(false); // Close sidebar on mobile
    };

    return (
        <section className={`${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`} style={{ minHeight: "100vh" }}>
            {/* Top Navbar */}
            <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} className="p-3 d-md-none shadow-sm">
                <Button variant={darkMode ? "outline-light" : "outline-dark"} onClick={() => setShowSidebar(!showSidebar)}>
                    <FaBars />
                </Button>
                <Navbar.Brand className="ms-3">Auction Dashboard</Navbar.Brand>
                <Button variant="outline-warning" className="ms-auto" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </Button>
            </Navbar>

            <div className="container-fluid d-flex">
                {/* Sidebar */}
                {showSidebar && (
                    <div className="position-fixed vh-100 p-3 shadow-sm" 
                        style={{ width: "250px", backgroundColor: darkMode ? "#222" : "#f8f9fa", transition: "0.3s" }}>
                        <h4 className="text-center mb-4" style={{ color: darkMode ? "#FFD700" : "#333" }}>
                            Auction Dashboard
                        </h4>
                        <ul className="list-unstyled">
                            <li 
                                className={`p-3 rounded ${activeTab === "items" ? "bg-primary text-white" : "text-dark"}`} 
                                style={{ cursor: "pointer" }}
                                onClick={() => handleTabChange("items")}
                            >
                                <FaClipboardList className="me-2"/>Auction Items
                            </li>
                            <li 
                                className={`p-3 rounded ${activeTab === "add" ? "bg-success text-white" : "text-dark"}`} 
                                style={{ cursor: "pointer" }}
                                onClick={() => handleTabChange("add")}
                            >
                                <FaPlus className="me-2" /> Post Auction
                            </li>
                            <li 
                                className="p-3 text-danger fw-bold mt-5" 
                                style={{ cursor: "pointer" }}
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt /> Log out
                            </li>
                        </ul>
                    </div>
                )}

                {/* Main Content */}
                <div className={`p-4 vh-100 w-100 ${darkMode ? "bg-secondary" : "bg-white"}`} 
                    style={{ marginLeft: showSidebar ? "250px" : "0", transition: "0.3s" }}>
                    <div className="d-flex justify-content-end">
                        <Button variant="outline-warning" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </Button>
                    </div>
                    {isItems ? <DisplayAuctionItems /> : <AddAuctionItem />}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
