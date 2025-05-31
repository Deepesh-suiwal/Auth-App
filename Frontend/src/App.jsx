import React, { useState, useEffect } from "react";
import instance from "./axiosConfig.js";

function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await instance.post(endpoint, form);
      console.log(res.data);

      if (isRegister) {
        alert("Registered successfully! You can now log in.");
        setIsRegister(false);
      } else {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      }

      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  }

  useEffect(() => {
    if (!token) return;
    async function fetchUser() {
      try {
        const res = await instance.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setToken("");
      }
    }
    fetchUser();
  }, [token]);
  function updateRegister() {
    setIsRegister(!isRegister);
    setForm({ name: "", email: "", password: "" });
  }
  return (
    <div>
      <h1>React + Node + MongoDB Auth App</h1>
      {!token ? (
        <div>
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">{isRegister ? "Register" : "Login"}</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button onClick={updateRegister}>
              {isRegister ? "Login here" : "Register here"}
            </button>
          </p>
        </div>
      ) : (
        <div>
          <h2>Welcome {user?.name}</h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
              setUser(null);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
