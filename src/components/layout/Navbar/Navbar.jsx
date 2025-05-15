import { useContext, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { UserContext } from "../../../../context/userContext";
import { useNavigate } from "react-router";
function Navbar() {
  const { signout, getUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then((user) => {
      let initials = handleNameInitials(user.firstName); //TODO get full name
      user.initials = initials;
      console.log(user);

      setUser(user);
    });
  }, []);

  function handleNameInitials(name) {
    if (!name) return "USER";
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
