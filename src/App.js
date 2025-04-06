// App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import TodoHome from "./Pages/TodoHome";
import SetNewPassword from "./Pages/SetNewPassword";

function App() {
  const [login, setLogin] = useState(() => {
    return JSON.parse(localStorage.getItem("isLoggedIn")) || false;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(login));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [login, currentUser]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          login ? (
            <TodoHome setLogin={setLogin} currentUser={currentUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/todo-app" element={<TodoHome setLogin={setLogin} />} />

      <Route
        path="/login"
        element={
          login ? (
            <Navigate to="/" replace />
          ) : (
            <Login setLogin={setLogin} setCurrentUser={setCurrentUser} />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="*"
        element={
          <h1 className="text-center text-red-500">404 Page not found</h1>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* <Route path="/reset-password/:token" element={<SetNewPassword />} /> */}

      <Route path="/reset-password/:token" element={<SetNewPassword />} />


    </Routes>
  );
}

export default App;
