import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import axios from "axios";
import bcrypt from "bcryptjs";
import { gsap } from "gsap";

export default function Login({ setLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const formRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUser(null);

    try {
      const res = await axios.get(
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
      <div
        ref={formRef}
        className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl  transition-all duration-300"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-medium transition duration-300"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

        <div className="mt-5 text-sm text-center">
          <Link to="/reset-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <p className="mt-2">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
