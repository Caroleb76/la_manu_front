import PopupForm from "../../components/forms/PopupForm/Popupform";
import styles from "./PopupCreateUser.module.css";
import { Icon } from "@iconify/react";
function PopupCreateUser({onClose}) {
  
  return (
    <div className={styles.blockUI} >
    <div className={`contentPadding ${styles.borderPopup} ${styles.popupContainer}`}>
      <Icon icon="material-symbols:close-rounded" width="2rem"  className={styles.closeIcon} onClick={onClose} />
      <div>
        <h2 className="title">Nouvel Utilisateur</h2>
      </div>
      <PopupForm />
    </div>

    </div>
  );
}

export default PopupCreateUser;
