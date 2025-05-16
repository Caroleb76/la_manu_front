import { StrictMode, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./views/Home/Home";
import Signup from "./views/Auth/Signup";
import Login from "./views/Auth/Login";
import Dashboard from "./views/dashboard/Dashboard";
import Users from "./views/Users/users";
import { UserProvider, UserContext } from "../context/userContext";
import AuthGuard from "./components/auth/AuthGuard";
import AboutUs from "../aboutus";
import Profile from "./views/Profile/Profile"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
        <Route index element={<AuthGuard />} />
          <Route path="about" element={<AboutUs />} />
          <Route element={<AuthGuard />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />

            <Route path="dashboard" element={<Dashboard />}>
              <Route path="main" element={<Home />} />
              {/* <Route path="users" element={<Users />} /> */}
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
