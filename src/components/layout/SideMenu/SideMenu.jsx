import styles from "./SideMenu.module.css";
import logo from "../../../assets/img/Logo.svg";
import { NavLink } from "react-router";
import { Icon } from "@iconify/react";
function SideMenu() {
  return (
    <>
      <div className={styles.menuContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo de l'IFEN" />
          <hr />
        </div>
        <div className={styles.itemsList}>
          <NavLink
            to="/dashboard/main"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.menuItemContent}>
              <Icon
                className={styles.menuIcon}
                icon="hugeicons:dashboard-browsing"
                width={"1.8rem"}
                fill={"green"}
              />
              <p>Dashboard</p>
            </div>
          </NavLink>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.menuItemContent}>
              <Icon
                className={styles.menuIcon}
                icon="hugeicons:user-group-02"
                width={"1.8rem"}
                fill={"green"}
              />
              <p>Utilisateurs</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/notifications"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.menuItemContent}>
              <Icon
                className={styles.menuIcon}
                icon="hugeicons:notification-01"
                width={"1.8rem"}
                fill={"green"}
              />
              <p>Notifications</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/formations"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.menuItemContent}>
              <Icon
                className={styles.menuIcon}
                icon="hugeicons:book-open-01"
                width={"1.8rem"}
                fill={"green"}
              />
              <p>Formations</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/contracts"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.menuItemContent}>
              <Icon
                className={styles.menuIcon}
                icon="hugeicons:contracts"
                width={"1.8rem"}
                fill={"green"}
              />
              <p>Contrats</p>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              ` ${styles.menuItem} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.menuItemContent}>
              <Icon
                className={styles.menuIcon}
                icon="hugeicons:user"
                width={"1.8rem"}
                fill={"green"}
              />
              <p>Profil</p>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default SideMenu;
