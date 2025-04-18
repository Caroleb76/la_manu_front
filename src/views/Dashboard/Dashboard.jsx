import SideMenu from "../../components/layout/SideMenu/SideMenu";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "./Dashboard.module.css";
import { Outlet } from "react-router";
function Dashboard() {
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
