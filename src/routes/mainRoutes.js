import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import Header from "../pages/header/header.jsx";
import Register from "../pages/register";
import Summary from "../pages/summary";
import NotFound from "../pages/notFound/notFound.jsx";
import Blog from "../pages/blogPage/blog.jsx";
import Post from "../pages/post";
import HomePage from "../pages/homePage/homePage.jsx";
import MyPosts from "../pages/myPosts/myPosts.jsx";
import LandingPage from "../pages/landingPage/landing.jsx";
import ContactUs from "../pages/contactUs/contactUs.jsx";
import SelectedPosts from "../pages/selectedUserPosts/selectedUserPosts.jsx";

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <>
      {isLoggedIn && <Header isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/landing" /> : <Login />}
        />
        <Route
          path="/registration"
          element={isLoggedIn ? <Navigate to="/landing" /> : <Register />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/summary" element={<Summary />} />
          <Route path="/services" element={"services"} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/post" element={<Post />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/selectedPosts/:selectId" element={<SelectedPosts />} />

          <Route path="/*" element={<NotFound />} />

          <Route path="" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
