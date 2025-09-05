import { StrictMode, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./views/Home/Home";
import Signup from "./views/Auth/Signup";
import Login from "./views/Auth/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import Users from "./views/Users/users";
import { UserProvider, UserContext } from "../context/userContext";
import AuthGuard from "./components/auth/AuthGuard";
import AboutUs from "../aboutus";
import Profile from "./views/Profile/Profile";
import Contracts from "./views/Contracts/Contracts";
import Notifications from "./views/Notifications/Notifications";
import { NotificaitonProvider } from "../context/notificationContext";
import Formations from "./views/Formations/Formations";
import CreateContract from "./views/Contracts/createContract/CreateContract";
import Sessions from "./views/Sessions/Sessions";
import Interventions from "./views/Interventions/Interventions";
import EditContract from "./views/Contracts/editContract/EditContract";
import ViewContract from "./views/Contracts/viewContract/ViewContract";


createRoot(document.getElementById("root")).render(
    <UserProvider>
        <NotificaitonProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<AuthGuard />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route element={<AuthGuard />}>
                        <Route path="signup" element={<Signup />} />
                        <Route path="login" element={<Login />} />


                        <Route path="dashboard" element={<Dashboard />}>
                            <Route path="main" element={<Home />} />
                            <Route path="interventions" element={<Interventions />} />
              <Route path="users" element={<Users />} />
                            <Route
                                path="notifications"
                                element={<Notifications />}
                            />
                            <Route path="formations" element={<Formations />} />
                            <Route path="sessions" element={<Sessions />} />
                            <Route path="contracts">
                                <Route index element={<Contracts />} />
                                <Route path="view/:contractId" element={<ViewContract />} />
                                <Route
                                    path="create"
                                    element={<CreateContract />}
                                />
                                <Route
                                    path="edit/:contractId"
                                    element={<CreateContract />}
                                />
                                <Route
                                    path="sign/:contractId"
                                    element={<CreateContract />}
                                />

                            </Route>

                            <Route path="profile" element={<Profile />} />
                            <Route path="interventions" element={<Interventions />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </NotificaitonProvider>
    </UserProvider>
);
