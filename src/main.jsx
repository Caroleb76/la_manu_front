import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./views/Home/Home";
import Signup from "./views/Auth/Signup";
import Login from "./views/Auth/Login";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
