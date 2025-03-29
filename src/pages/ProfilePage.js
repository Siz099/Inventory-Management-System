import React, { useState, useEffect } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = ApiService.getLoggedInUserInfo(); // Get the logged-in user's info
        if (userInfo) {
          setUser(userInfo); // Set the user state with the fetched user info
        } else {
          setMessage("User not found. Please log in again."); // Show an error message if no user is found
        }
      } catch (error) {
        showMessage("Error fetching user data: " + error.message);
      }
    };
    fetchUserInfo();
  }, []);

  // Method to show messages or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="profile-page">
        {user ? (
          <div className="profile-card">
            <h1>Hello, {user.name} 🥳</h1>
            <div className="profile-info">
              <div className="profile-item">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="profile-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="profile-item">
                <label>Phone Number:</label>
                <span>{user.phoneNumber}</span>
              </div>
              <div className="profile-item">
                <label>Role:</label>
                <span>{user.role}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p> // Show loading text while fetching user info
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
