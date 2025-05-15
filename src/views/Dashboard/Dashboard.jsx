import SideMenu from "../../components/layout/SideMenu/SideMenu";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "./Dashboard.module.css";
import { Outlet, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
function Dashboard() {
  const {getUser}=useContext(UserContext);
  const navigate= useNavigate();
  useEffect(()=>{
    getUser().then(user=>{
      if(!user) navigate("/login");
    });
  },[])
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
