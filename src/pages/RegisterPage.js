import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService"; // Ensure correct path

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userData = { name, email, password, phoneNumber, role: "user" };

      // Fetch users and check if email already exists
      const existingUsers = await ApiService.getUsers();
      console.log("Existing users:", existingUsers);
      const userExists = existingUsers.some((user) => user.email === email);

      if (userExists) {
        setMessage("Email is already registered. Please login.");
        return;
      }

      // Register new user
      const response = await ApiService.registerUser(userData);
      console.log("Register response:", response);

      if (response.status === 201) {
        setMessage("Registration Successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("Failed to register. Please try again.");
      }
    } catch (error) {
      setMessage("Error Registering: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default RegisterPage;
