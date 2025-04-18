import styles from "./SideMenu.module.css";
import logo from "../../../assets/img/Logo.svg";
import { NavLink  } from "react-router";
function SideMenu() {
  return (
    <>
      <div className={styles.menuContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo de l'IFEN" />
          <hr />
        </div>
        <div className={styles.itemsList}>
            <NavLink to="/dashboard/main" className={({ isActive }) => ` ${styles.menuItem} ${isActive ? styles.active : ""}`}>
            <i className="fas fa-home"></i>
            <p>Dashboard</p>
            </NavLink>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <i className="fas fa-home"></i>
            <p>Utilisateurs</p>
          </NavLink>

          <NavLink
            to="/dashboard/notifications"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <i className="fas fa-home"></i>
            <p>Notifications</p>
          </NavLink>

          <NavLink
            to="/dashboard/formatinos"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <i className="fas fa-home"></i>
            <p>Formations</p>
          </NavLink>

          <NavLink
            to="/dashboard/contracts"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <i className="fas fa-home"></i>
            <p>Contrats</p>
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <i className="fas fa-home"></i>
            <p>Profil</p>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
