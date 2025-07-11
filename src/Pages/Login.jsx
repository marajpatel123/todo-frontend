import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import axios from "axios";
import bcrypt from "bcryptjs";

export default function Login({ setLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUser(null);

    try {
      const res = await axios.get(
        // `http://localhost:5000/register/${email}`
        `https://todo-backend-r4rx.onrender.com/register/${email}`
      );

      const fetchedUser = res.data;
      const hashedPassword = fetchedUser.password;

      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (isMatch) {
        setUser(fetchedUser);
        setLogin(true);
        localStorage.setItem("userId", fetchedUser._id);
        localStorage.setItem("userName", fetchedUser.name);
        setTimeout(() => navigate("/todo-app"), 0);
      } else {
        setError("❌ Incorrect password");
        setLogin(false);
      }
    } catch (e) {
      console.error("Error fetching user:", e);
      setError(e.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <AuthLayout title="Login to Your Account">
      <div className="max-w-md mx-auto p-6  rounded-lg ">
        <form className="space-y-4 " onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 text-[20px] font-semibold rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        <div className="mt-4 text-sm text-center">
          <Link to="/reset-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <br />
          <span>Don't have an account?</span>{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
