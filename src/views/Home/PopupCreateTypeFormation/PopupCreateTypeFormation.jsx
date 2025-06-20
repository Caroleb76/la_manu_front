import PopupFormTypeFormation from "../../components/forms/PopupTypeFormation/PopupformTypeFormation";
import styles from "./PopupCreateTypeFormation.module.css";
import { Icon } from "@iconify/react";
function PopupCreateTypeFormation({onClose,onUserCreated}) {
  
  return (
    <div className={styles.blockUI} >
    <div className={`contentPadding ${styles.borderPopup} ${styles.popupContainer}`}>
      <Icon icon="material-symbols:close-rounded" width="2rem"  className={styles.closeIcon} onClick={onClose} />
      <div>
        <h2 className="title">Nouveau type de formation</h2>
      </div>
      <PopupFormTypeFormation onUserCreated={onUserCreated} />
    </div>

    </div>
  );
}

export default PopupCreateTypeFormation;
