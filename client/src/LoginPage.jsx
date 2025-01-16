import React, { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (action) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/cat201project/Login",
        {
          action,
          username,
          password,
        }
      );

      // Check the server response format
      if (response.data.success) {
        setMessage(
          `${action.charAt(0).toUpperCase() + action.slice(1)} successful!`
        );
      } else {
        setMessage(
          `${action.charAt(0).toUpperCase() + action.slice(1)} failed: ${
            response.data.message
          }`
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <h1>E-Commerce Login & Signup</h1>
      <div>
        <label>Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={() => handleSubmit("login")}>Login</button>
      <button onClick={() => handleSubmit("signup")}>Signup</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;
