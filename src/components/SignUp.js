import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./auth.css";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState("");
  const navigate = useNavigate();

  const generateStrongPassword = () => {
    return Math.random().toString(36).slice(-8) + "A1!";
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.warning("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }
    if (!isStrongPassword(password)) {
      const newSuggestedPassword = generateStrongPassword();
      setSuggestedPassword(newSuggestedPassword);
      toast.error("Weak password! A strong password has been suggested.");
      return;
    }

    const user = { username, email, password };

    try {
      const response = await axios.post("http://localhost:5000/auth/register", user);
      if (response.status === 201) {
        toast.success("Registration Successful!");
        setTimeout(() => navigate('/signin'), 1500);
      }
    } catch (error) {
      toast.error("The email already exists.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 shadow-lg rounded-4 text-center" style={{ width: "400px", backgroundColor: "#fff", borderRadius: "15px" }}>
        <h2 className="text-center mb-3 text-primary fw-bold">Welcome to BidRushX</h2>
        <p className="text-muted">Create an account to start bidding!</p>
        <form onSubmit={handleRegister} className="text-start">
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="text-muted">Use at least 8 characters, including uppercase, lowercase, a number, and a special character.</small>
            {suggestedPassword && <p className="text-danger mt-1">Suggested Password: <b>{suggestedPassword}</b></p>}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn w-100 py-2" type="submit" style={{ backgroundColor: "#ff4081", color: "white", fontWeight: "bold", borderRadius: "8px" }}>
            Register
          </button>

          <p className="mt-3 text-center">
            Already have an account?
            <Link to='/signin' className="text-primary fw-bold ms-1">Sign In</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
