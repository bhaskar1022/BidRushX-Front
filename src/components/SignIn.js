import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./auth.css";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const user = { email, password };

    try {
      const response = await axios.post("http://localhost:5000/auth/login", user);
      const { token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login Successful!");
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Login failed! Please check your credentials and try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" >
      <div className="card p-5 shadow-lg rounded-4 text-center" style={{ width: "400px", backgroundColor: "#fff", borderRadius: "15px" }}>
        <h2 className="text-center mb-3 text-primary fw-bold">Welcome Back to BidRushX</h2>
        <p className="text-muted">Sign in to continue bidding!</p>
        <form onSubmit={handleLogin} className="text-start">
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
          </div>

          <button className="btn w-100 py-2" type="submit" style={{ backgroundColor: "#ff4081", color: "white", fontWeight: "bold", borderRadius: "8px" }}>
            Sign In
          </button>

          <p className="mt-3 text-center">
            Don't have an account?
            <Link to='/signup' className="text-primary fw-bold ms-1">Sign Up</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignInPage;
