import styles from "./FileItem.module.css";
import fileImage from "../../../assets/img/file.png";
import filesHelper from "../../../helpers/filesHelper";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { set } from "zod/v4-mini";
import { useNotification } from "../../../../context/notificationContext";

function FileItem({ file, onFileDeleted }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [fileClicked, setFileClicked] = useState(false);
  const [deleteFileConfirmation, setDeleteFileConfirmation] = useState(false);
  const { notify } = useNotification();
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFileClicked(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  function onFileClicked() {
    setFileClicked(true);
    //  filesHelper.downloadFile(file.url, file.name);
  }

  function onDownloadClicked() {
    filesHelper.downloadFile(file.url, file.name);

  }
  async function onDeleteClicked() {
    try{
      await filesHelper.deleteFile(file.id);
      onFileDeleted();
      notify("Fichier supprimé", "success");

    }finally{
      setFileClicked(false);
      setDeleteFileConfirmation(false)

    }
  }

  return (
    <div ref={wrapperRef} className={styles.fileItem + (fileClicked ? " " + styles.active : "")} onClick={() => { onFileClicked() }} role="button" tabIndex={0}>
      {deleteFileConfirmation &&
        <div className={styles.confirmatiionDialogBlock}>
          <div className={styles.confirmationDialog}>
            <p>Voulez-vous vraiment supprimer ce fichier ?</p>
            <div className={styles.dialogButtons}>
              <p onClick={() => setDeleteFileConfirmation(false)}>Annuler</p>
              <p onClick={onDeleteClicked}>Supprimer</p>
            </div>
          </div>
        </div>
      }
      <img src={fileImage} alt="file icon" />
      <p>{file.name}</p>
      {fileClicked && <div className={styles.options}>
        <p onClick={onDownloadClicked}>Telecharger <Icon icon="material-symbols:download-rounded" /></p>
        <p onClick={() => setDeleteFileConfirmation(true)}>Supprimer <Icon icon="material-symbols:delete-rounded" /></p>
      </div>}
    </div>
  );
}

export default FileItem;
