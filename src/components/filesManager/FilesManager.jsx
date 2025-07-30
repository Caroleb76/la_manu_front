import { use, useContext, useEffect, useState } from "react";
import FileItem from "./fileItem/FileItem";
import styles from "./FilesManager.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import filesHelper from "../../helpers/filesHelper";
import { UserContext } from "../../../context/userContext";
import InputFile from "../ui/InputFile";
import InputText from "../ui/InputText";
import { useNotification } from "../../../context/notificationContext";

function FilesManager({ initialUserId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileNameInput, setFileNameInput] = useState("");
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(initialUserId);
  const { user } = useContext(UserContext);
  const [docType, setDocType] = useState("");
  const [diplomaType, setDiplomaType] = useState("");

  const { notify } = useNotification();
  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    let resolvedUserId = initialUserId;
    if (!resolvedUserId) {
      const userData = user
      resolvedUserId = userData.id;
    }
    setUserId(resolvedUserId);
    try {
      const userFiles = await filesHelper.getUserFiles(resolvedUserId);
      console.log(userFiles);

      setFiles(userFiles.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
    }
  }

  function onFileSelected(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileNameInput(file.name);
    }
  }

  async function uploadFile() {
    if (!selectedFile || !docType || (docType === "Autre" && !fileNameInput.trim())) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("filename", fileNameInput.trim());
    formData.append("docType", docType);
    if (docType === "Diplome") {
      const finalName = fileNameInput.trim() + "_" + diplomaType;
      formData.set("filename", finalName);
    }

    try {
      await filesHelper.uploadFile(formData);
      setSelectedFile(null);
      setFileNameInput("");
      setDocType("");
      setDiplomaType("");
      loadFiles();
      notify("Fichier envoyé", "success");
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
    }
  }


  return (
    <div className={styles.fileContainer}>


      {selectedFile && (
        <div className={styles.fileAddPopupBlock}>
          <div className={styles.fileAddPopup}>
            <Icon
              icon="material-symbols:close-rounded"
              width="1.5rem"
              className={styles.closeIcon}
              onClick={() => {
                setSelectedFile(null);
                setFileNameInput("");
                setDocType("");
                setDiplomaType("");
              }}
            />


            <select
              value={docType}
              onChange={(e) => {
                setDocType(e.target.value);
                if (e.target.value !== "Autre") {
                  setFileNameInput(e.target.value);
                } else {
                  setFileNameInput("");
                }
              }}
              className={styles.select}
            >
              <option value="">Type de fichier</option>
              <option value="Photo de profil">Photo de profil</option>
              <option value="CV de moins de 3 mois">CV de moins de 3 mois</option>
              <option value="Carte grise">Carte grise</option>
              <option value="Diplome">Diplôme</option>
              <option value="Autre">Autre</option>
            </select>


            {docType === "Diplome" && (
              <select
                value={diplomaType}
                onChange={(e) => setDiplomaType(e.target.value)}
                className={styles.select}
              >
                <option value="">Type de diplôme</option>
                <option value="Type1">Type1</option>
                <option value="Type2">Type2</option>
                <option value="Type3">Type3</option>
                <option value="Type4">Type4</option>
              </select>
            )}


            {docType === "Autre" && (
              <input
                type="text"
                placeholder="Nom du fichier"
                value={fileNameInput}
                onChange={(e) => setFileNameInput(e.target.value)}
                className={styles.input}
              />
            )}

            <button className={styles.addButton} onClick={uploadFile}>
              Ajouter
            </button>
          </div>
        </div>
      )}



      <label htmlFor="fileInput" className={`${styles.addButton} ${styles.fileAdd}`}>
        Ajouter
      </label>
      <input
        type="file"
        id="fileInput"
        name="addFile"
        accept=".pdf,.doc,.docx,.jpg,.png"
        hidden
        onChange={onFileSelected}
      />


      <div className={styles.fileSection}>
        <div className={styles.fileGrid}>
          {files?.length > 0 ? (
            files.map((file, index) => (
              <FileItem key={index} file={file} onFileDeleted={loadFiles} />
            ))
          ) : (
            <p className={styles.noFile}>Aucun fichier</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilesManager;

