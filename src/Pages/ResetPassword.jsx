import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../Components/AuthLayout";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await axios.post("https://todo-backend-r4rx.onrender.com/forgot-password", {
        email,
      });
      setMsg(res.data.message || "✅ Reset link sent to your email");
    } catch (err) {
      console.error("Reset error:", err);
      const errorMessage =
        err.response?.data?.message || "❌ Error sending reset email";
      setError(errorMessage);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Send Reset Link
        </button>
      </form>
      {msg && <p className="text-green-500 text-center mt-2">{msg}</p>}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <div className="mt-4 text-sm text-center">
        <Link to="/login" className="text-yellow-500 hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
