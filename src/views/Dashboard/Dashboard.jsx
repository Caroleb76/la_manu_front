import SideMenu from "../../components/layout/SideMenu/SideMenu";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "./Dashboard.module.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { useNotification } from "../../../context/notificationContext";
function Dashboard() {
  const {getUser}=useContext(UserContext);
  const navigate= useNavigate();
  const {notify}= useNotification();
  useEffect(() => {
    getUser().then(user => {
      if (!user) navigate("/login");
    });

  }, [location]);
  

  return <>
     <div className={styles.layoutContainer}>
        <SideMenu></SideMenu>
        <div className={styles.layoutContent}>
            <Navbar></Navbar>
            <main className={styles.layoutBody}>

                <Outlet/>

            </main>
        </div>
     </div>
  </>;
}

export default Dashboard;
