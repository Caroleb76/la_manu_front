import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./views/Home/Home";
import Auth from "./views/Auth/Auth";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
