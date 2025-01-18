import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    role: "user",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Attempting login with:", {
      email: email,
      password: password,
    });

    try {
      const response = await fetch(
        "http://localhost:8080/cat201project/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      console.log("Full response:", response); // Log full response
      console.log("Response status:", response.status); // Log response status

      const data = await response.json();
      console.log("Response data:", data); // Log response data

      if (data.success) {
        // Store user data including role
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            role: data.role,
            username: data.username,
          })
        );

        // Navigate based on role
        if (data.role === "admin") {
          window.location.href = "/cardCategory";
        } else {
          window.location.href = "/App";
        }
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("An error occurred during login.");
      console.error("Login error:", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/cat201project/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `action=signup&${Object.entries(signupData)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&")}`,
        }
      );

      if (response.ok) {
        alert("Signup successful! Please login.");
        setShowSignup(false);
        setSignupData({
          username: "",
          full_name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          role: "user",
        });
      } else {
        const text = await response.text();
        alert(text || "Signup failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="login-box">
      {!showSignup ? (
        <>
          <h2>Login</h2>
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
          <button className="create" onClick={() => setShowSignup(true)}>
            Create Account
          </button>
        </>
      ) : (
        <div className="modal">
          <div className="modal-content">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={signupData.full_name}
                onChange={(e) =>
                  setSignupData({ ...signupData, full_name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={signupData.address}
                onChange={(e) =>
                  setSignupData({ ...signupData, address: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="City"
                value={signupData.city}
                onChange={(e) =>
                  setSignupData({ ...signupData, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="State"
                value={signupData.state}
                onChange={(e) =>
                  setSignupData({ ...signupData, state: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={signupData.zip}
                onChange={(e) =>
                  setSignupData({ ...signupData, zip: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={signupData.country}
                onChange={(e) =>
                  setSignupData({ ...signupData, country: e.target.value })
                }
                required
              />
              <button type="submit">Sign Up</button>
              <button type="button" onClick={() => setShowSignup(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
