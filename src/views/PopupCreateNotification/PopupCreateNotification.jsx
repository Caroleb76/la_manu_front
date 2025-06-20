import PopupFormNotification from "../../components/forms/PopupFormNotification/PopupformNotification";
import styles from "./PopupCreateNotification.module.css";
import { Icon } from "@iconify/react";
function PopupCreateNotification({onClose,onUserCreated}) {
  
  return (
    <div className={styles.blockUI} >
    <div className={`contentPadding ${styles.borderPopup} ${styles.popupContainer}`}>
      <Icon icon="material-symbols:close-rounded" width="2rem"  className={styles.closeIcon} onClick={onClose} />
      <div>
        <h2 className="title">Nouvelle notification</h2>
      </div>
      <PopupFormNotification onUserCreated={onUserCreated} />
    </div>

    </div>
  );
}

export default PopupCreateNotification;
