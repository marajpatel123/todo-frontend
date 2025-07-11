import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../Components/AuthLayout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://todo-backend-r4rx.onrender.com/forgot-password", 
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      setMsg(res.data.message || "✅ Reset link sent to your email. Check your inbox (and spam folder).");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset error:", err);
      const errorMessage =
        err.response?.data?.message || 
        err.response?.data?.error || 
        "❌ Error sending reset email. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your registered email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      
      {msg && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {msg}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-center">
        <Link 
          to="/login" 
          className="text-yellow-600 hover:text-yellow-700 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
