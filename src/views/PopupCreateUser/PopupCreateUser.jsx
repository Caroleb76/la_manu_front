import PopupFormUser from "../../components/forms/PopupFormUser/PopupformUser";
import styles from "./PopupCreateUser.module.css";
import { Icon } from "@iconify/react";
function PopupCreateUser({onClose,onUserCreated}) {
  
  return (
    <div className={styles.blockUI} >
    <div className={`contentPadding ${styles.borderPopup} ${styles.popupContainer}`}>
      <Icon icon="material-symbols:close-rounded" width="2rem"  className={styles.closeIcon} onClick={onClose} />
      <div>
        <h2 className="title">Nouvel Utilisateur</h2>
      </div>
      <PopupFormUser onUserCreated={onUserCreated} />
    </div>

    </div>
  );
}

export default PopupCreateUser;
