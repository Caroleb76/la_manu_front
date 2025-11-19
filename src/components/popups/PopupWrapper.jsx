import styles from "./PopupWrapper.module.css";
import { Icon } from "@iconify/react";
function PopupWrapper({ title, onClose, children }) {
  return (
    <div className={styles.blockUI}>
      <div
        className={`contentPadding ${styles.borderPopup} ${styles.popupContainer}`}
      >
        <Icon
          icon="material-symbols:close-rounded"
          width="2rem"
          className={styles.closeIcon}
          onClick={onClose}
        />
        <div>
          <h2 className="title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default PopupWrapper;
