import PopupForm from "../../components/forms/PopupForm/Popupform";
import styles from "./PopupCreateUser.module.css";

function Profile() {
  return (
    <div className={`contentPadding ${styles.borderPopup}`}>
      <div>
        <h2 className="title">Nouvel Utilisateur</h2>
      </div>
      <PopupForm />
    </div>
  );
}

export default Profile;
