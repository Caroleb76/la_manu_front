import { forwardRef, use, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import FileItem from "./fileItem/FileItem";
import styles from "./FilesManager.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import filesHelper from "../../helpers/filesHelper";
import { UserContext } from "../../../context/userContext";
import InputFile from "../ui/InputFile";
import InputText from "../ui/InputText";
import { useNotification } from "../../../context/notificationContext";
import { set } from "zod/v4-mini";
//enum filesManagerType
export const filesManagerType = {
  PROFILE: "profile",
  INTERVENTIONS: "interventions",
}
const FilesManager = forwardRef(function FilesManager({ userId, type, extraCostId, interventionId,onFileSelectedCallback }, ref) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileNameInput, setFileNameInput] = useState("");
  const [files, setFiles] = useState([]);
  const { user } = useContext(UserContext);
  const [docType, setDocType] = useState(interventionId ? "Autre" : "");
  const [diplomaType, setDiplomaType] = useState("");
  const [miniMode, setMiniMode] = useState(type === filesManagerType.INTERVENTIONS);
  const [miniModeFileDisplayName, setMiniModeFileDisplayName] = useState("");
  const { notify } = useNotification();
  const formDataRef = useRef(null);
  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    let currentUserId = userId;
    if (!currentUserId) {
      currentUserId = user.id
    }

    try {
      let files;
      if (type == filesManagerType.INTERVENTIONS) {
        if (!extraCostId) return;
        files = await filesHelper.getExtraCostFiles(currentUserId, extraCostId);
      } else {

        files = await filesHelper.getUserFiles(currentUserId);
      }
      console.log(files);

      setFiles(files.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
    }
  }

  function onFileSelected(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileNameInput(file.name);
      if(interventionId) setDocType("Autre");
      if(onFileSelected) onFileSelectedCallback(file);
    }
  }
  function reset() {
    // setSelectedFile(null);
    setFileNameInput("");
    setDocType("");
    setDiplomaType("");

  }

  function buildFormData(formData) {
    const idToSend = userId ? userId : user.id
    formData.append("filename", fileNameInput.trim());
    formData.append("docType", docType);
    formData.append("userId", idToSend);
    if (docType === "Diplome") {
      const finalName = fileNameInput.trim() + "_" + diplomaType;
      formData.set("filename", finalName);
    }
    // if the interventionId is not null, it means that the form data is for an extra cost
    if (interventionId) {
      formData.append("interventionId", interventionId);
      formDataRef.current = formData;
      reset();
      return false;
    }
    return true;
  }
  async function uploadFile(createdExtraCostId) {
    console.log("selectedFile", selectedFile, "docType", docType, "fileNameInput", fileNameInput);
    if ((!selectedFile || !docType || (docType === "Autre" && !fileNameInput.trim())) && !createdExtraCostId) return;
    console.log("passed the first condition");
    
    setMiniModeFileDisplayName(fileNameInput);
    // if hte reference of the form data is null, it means that the form data is not yet created
    let formData = new FormData();
    if (!formDataRef.current) {
      const uploadFileNow =buildFormData(formData);
      if(!uploadFileNow) return;
    } 
    
    else {
      if (!createdExtraCostId) {
      const uploadFileNow =buildFormData(formData);
      if(!uploadFileNow) return;
      }
      formData = formDataRef.current;
      formData.append("extraCostId", createdExtraCostId);
      console.log("setting formData from ref", formData, formDataRef.current);
    }

    // we add the file as the last element to the format data so we will be able to use all the data before (when adding the file as the first element all other data will be lost)
    formData.append("file", selectedFile);
    
    try {
      await filesHelper.uploadFile(formData);
      console.log("file uploaded");

      reset();
      loadFiles();
      notify("Fichier envoyé", "success");
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
    }
  }

  useImperativeHandle(ref, () => ({
    uploadPendingFiles: async (createdExtraCostId) => {

      await uploadFile(createdExtraCostId);
      await loadFiles();
    }
  }));

  return (
    <div className={styles.fileContainer + " " + (miniMode ? styles.miniMode : "")}>


      {(fileNameInput) && (
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


            {!miniMode &&
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
            }

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


            {(docType === "Autre" || miniMode) && (
              <input
                type="text"
                placeholder="Nom du fichier"
                value={fileNameInput}
                onChange={(e) => setFileNameInput(e.target.value)}
                className={styles.input}
              />
            )}

            <button className={styles.addButton} onClick={(e) => uploadFile(null)}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      {

        <p> {miniModeFileDisplayName}</p>
      }
      {
        !userId &&
        <>
          <label htmlFor="fileInput" className={`${styles.addButton} ${styles.fileAdd}`}>
            Ajouter un fichier
          </label>
          <input
            type="file"
            id="fileInput"
            name="addFile"
            accept=".pdf,.doc,.docx,.jpg,.png"
            hidden
            onChange={onFileSelected}
          /></>
      }

      {
        !miniMode &&
        <div className={styles.fileSection}>
          <div className={styles.fileGrid}>
            {files?.length > 0 ? (
              files.map((file, index) => (
                <FileItem miniMode={miniMode} key={index} file={file} onFileDeleted={loadFiles} />
              ))
            ) : (
              <p className={styles.noFile}>Aucun fichier</p>
            )}
          </div>
        </div>

      }
    </div>
  );
});

export default FilesManager;

