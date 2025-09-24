import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { UserContext } from "../../../../context/userContext";
import { useNavigate } from "react-router";
import { handleNameInitials } from "../../../utils/initials";
function Navbar() {
  const { signout, user} = useContext(UserContext);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;



  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [user]);


  function handleLogout() {
    signout();
    navigate("/login");
  }
  return (
    <>
      <div className={styles.navbarContainer}>
        <div
          className={styles.userAvatar}
          onClick={() => setDropdown(!dropdown)}
          ref={wrapperRef}
        >
          {user?.profilePicture ? (
            <img
              src={`${serverUrl}${user.profilePicture}?v=${user.profilePicVersion ?? 0}`}
              alt="avatar"
            />
          ) : (
            <p>{user?.initials}</p>
          )}
          {dropdown && (
            <div
              className={`${styles.dropdownContent}, ${dropdown ? styles.dropdownVisible : ""
                }`}
            >
              <div className={styles.dropdownItem}>
                <p onClick={handleLogout}>Déconnexion</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
