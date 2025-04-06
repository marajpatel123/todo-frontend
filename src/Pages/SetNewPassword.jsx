import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SetNewPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

if (password !== confirmPassword) {
  return setErrorMsg("❌ Passwords do not match");
}

try {
  await axios.post(`https://todo-backend.onrender.com/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  setSuccessMsg("✅ Password updated successfully");
  setTimeout(() => navigate("/login"), 2000);
} catch (err) {
  console.error(err);
  setErrorMsg("❌ Something went wrong");
}

  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Set New Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Update Password
        </button>
      </form>
      {successMsg && <p className="mt-4 text-green-500 text-center">{successMsg}</p>}
    {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}

    </div>
  );
}
