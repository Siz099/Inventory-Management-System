import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService"; // Ensure the correct import path
import { TostafiErrorUtil, TostafiUtil } from "../utils/tostafi.util";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.login(email, password);

      if (response.success) {
        TostafiUtil("Login successful!");
        navigate("/dashboard");
      } else {
        TostafiErrorUtil(response.message);
      }
    } catch (error) {
      TostafiErrorUtil(
        "Error logging in: " + (error.message || "Unknown error")
      );
    }

    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
