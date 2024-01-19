import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import Header from "../pages/header";
import Register from "../pages/register";
import Summary from "../pages/summary";
import NotFound from "../pages/notFound";
import Blog from "../pages/blog";
import Post from "../pages/post";
import HomePage from "../pages/homePage";
import MyPosts from "../pages/myPosts";

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <>
      {isLoggedIn && <Header isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/registration"
          element={isLoggedIn ? <Navigate to="/home" /> : <Register />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/summary" element={<Summary />} />
          <Route path="/services" element={"services"} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/post" element={<Post />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
