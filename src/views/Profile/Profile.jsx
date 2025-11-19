import { useState } from "react";
import ProfileForm from "../../components/forms/ProfileForm/ProfileForm";
// import FileUpload from "../../components/forms/FileUpload/FileUpload";
import styles from "./Profile.module.css";
import FilesManager from "../../components/filesManager/FilesManager";

function Profile({ userId }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={styles.profile_container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab_button} ${activeTab === "profile" ? styles.active : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Information
        </button>
        <button
          className={`${styles.tab_button} ${activeTab === "upload" ? styles.active : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Fichiers
        </button>
      </div>

      {activeTab === "profile" && <ProfileForm userId={userId} />}
      {activeTab === "upload" && <FilesManager userId={userId} />}
    </div>
  );
}

export default Profile;
