import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './pages.css'
import "bootstrap/dist/css/bootstrap.min.css";

function WelcomePage() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    if (token) return null;

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
    <h1 className="display-3 fw-bold text-primary mb-3">BidRushX</h1>
    <p className="text-secondary lead mb-4">
        Join our online auction platform where buyers bid for items in real-time. Experience seamless and competitive bidding like never before!
    </p>
    <div className="d-flex gap-3">
        <Link to="/signup" className="btn btn-primary px-4 py-2">
            Sign Up
        </Link>
        <Link to="/signin" className="btn btn-dark px-4 py-2">
            Sign In
        </Link>
    </div>
</div>

    );
}

export default WelcomePage;