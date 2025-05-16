import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { UserContext } from "../../../../context/userContext";
import { useNavigate } from "react-router";
function Navbar() {
  const { signout, getUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    getUser().then((user) => {
      let initials = handleNameInitials(user.firstName); //TODO get full name
      user.initials = initials;
      

      setUser(user);
    });
  }, []);

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
  }, []);

  function handleNameInitials(name) {
    if (!name) return "?";
    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < words.length; i++) {
      initials += words[i][0].toUpperCase();
    }
    if (initials.length > 2) initials = initials.slice(0, 2);
    if (initials.length < 2)
      initials += words[words.length - 1][1].toUpperCase();
    return initials;
  }
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
          <p>{user?.initials}</p>
          {dropdown && (
            <div
              className={`${styles.dropdownContent}, ${
                dropdown ? styles.dropdownVisible : ""
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
