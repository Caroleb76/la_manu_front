import { useContext } from "react";
import styles from "./Navbar.module.css";
import { UserContext } from "../../../../context/userContext";
import { useNavigate } from "react-router";
function Navbar() {
  const {signout}=useContext(UserContext);
  const navigate= useNavigate();
  function handleLogout(){
    signout();
    navigate("/login");
  }
  return <>
    <div className={styles.navbarContainer}>
          <div className="logout">
            <button onClick={handleLogout}><p>Déconnexion</p></button>
          </div>
    </div>
  </>;
}

export default Navbar;
