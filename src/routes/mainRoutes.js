import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import Header from "../pages/header";
import Register from "../pages/register";

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <>
      {isLoggedIn && <Header isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/summary" /> : <Login />}
        />
        <Route
          path="/registration"
          element={isLoggedIn ? <Navigate to="/summary" /> : <Register />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/summary" element={"summary"} />
          <Route path="/services" element={"services"} />
          <Route path="/home" element={"home"} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
