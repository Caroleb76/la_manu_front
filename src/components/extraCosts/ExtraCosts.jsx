import { useContext, useEffect, useRef, useState } from "react";
import FilesManager, { filesManagerType } from "../filesManager/FilesManager";
import Styles from "./ExtraCosts.module.css";
import { UserContext } from "../../../context/userContext";
import extraCostsHelper from "../../helpers/extraCostsHelper";
import { useNotification } from "../../../context/notificationContext";
import filesHelper from "../../helpers/filesHelper";
import extraCostsCategoryHelper from "../../helpers/extraCostsCategoryHelper";

const ExtraCosts = ({ iv }) => {
  const { user } = useContext(UserContext);
  const [value, setValue] = useState(null);
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const filesManagerRef = useRef(null);
  const { notify } = useNotification();
  const [extraCosts, setExtraCosts] = useState([]);
  const [modificationMode, setModificationMode] = useState(false);
  const [selectedExtraCost , setSelectedExtraCost] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadExtraCosts = async () => {
    if (!iv?.id) return;
    try {
      setLoading(true);
      const extraCostResponse = await extraCostsHelper.getExtraCostsByInterventionId(iv.id);
      
      setExtraCosts(extraCostResponse.data || []);
    } catch (e) {
      console.error(e);
      notify("Impossible de charger les frais supplémentaires.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadExtraCosts();
    })();
  }, [iv?.id]);

  const submit = async () => {
    if (!String(value).trim() || (!fileIsSelected && selectedExtraCost.files.length === 0)) {
      notify("Veuillez remplir tous les champs, et ajouter un justificatif.", "error");
      return;
    }
    try {
      const payload = { category: selectedExtraCost.id, val: parseInt(value), interventionId: iv.id };
      const response = await extraCostsHelper.update(payload, selectedExtraCost.id);
      if (!response?.success) {
        notify(response?.message || "Échec de la création du frais.", "error");
        return;
      }
      const extraCostId = response.data.id;
      await filesManagerRef.current?.uploadPendingFiles(extraCostId);
      setValue(null);
      setFileIsSelected(false);
      setModificationMode(false);
      await loadExtraCosts();
      notify("Frais ajouté avec succès.", "success");
    } catch (e) {
      console.error(e);
      notify("Une erreur est survenue lors de l’enregistrement.", "error");
    }
  };

  const onFileSelected = () => setFileIsSelected(true);

  const deleteFile = async (id) => {
    const ok = window.confirm("Confirmez-vous la suppression de ce frais ?");
    if (!ok) return;
      try{
        await extraCostsHelper.destroy(id);
         notify("Fichier supprimé", "success");
   
       }finally{
         await loadExtraCosts();
   
       }
  };

    function onDownloadClicked(file) {
      filesHelper.downloadFile(file.url, file.name);
  
    }

  const valueFormating = (v) => {
  
    
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    try {
      return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
    } catch {
      return `${n} €`;
    }
  };

  const onModifyExtraCost = (ec) => {
    setSelectedExtraCost(ec);
    setModificationMode(true);
    try {
       setValue(parseInt(ec.val));
    } catch (error) {
      console.error(error);
      setValue(null);
    }
   
    
  }

  return (
    <>
      {!modificationMode ? 
      (
        <div className={Styles.mainContainer}>
          {/* <div className={Styles.headerRow}>
            <h3 className={Styles.title}>Frais supplémentaires</h3>
            <button
              type="button"
              className={`${Styles.btn} ${Styles.btnAdd}`}
              onClick={() => setCreationMode(true)}
            >
              Ajouter un frais
            </button>
          </div> */}

          <div className={Styles.tableCard}>
            {loading ? (
              <p className={Styles.loading}>Chargement…</p>
            ) : extraCosts?.length ? (
              <div className={Styles.tableContainer}>
                <table className={Styles.table}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Valeur</th>
                      <th style={{textAlign:"center"}}>Justificatif</th>
                      <th style={{textAlign:"center"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extraCosts.map((ec) => (
                      <tr key={ec.id}>
                        <td>{ec.category.name || "—"}</td>
                        <td>{valueFormating(ec.val)}</td>
                        <td>
                          {Array.isArray(ec.files) && ec.files.length > 0 ? (
                            <div className={Styles.pills}>
                              {ec.files.map((f) => (
                                <button
                                  key={f.id}
                                  onClick={() => onDownloadClicked(f)}
                                  title={`Télécharger ${f.name}`}
                                  className={Styles.pillLink}
                                >
                                  {f.name || "Justificatif"}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className={Styles.empty}>Aucun fichier</span>
                          )}
                        </td>
                        <td>
                          <div className={Styles.actions}>
                            {/* {Array.isArray(ec.files) && ec.files.length > 0 && (
                              <button
                                onClick={() => onDownloadClicked(ec.files[0])}
                                download
                                title="Télécharger le premier justificatif"
                                className={`${Styles.btn} ${Styles.btnGhostPrimary}`}
                              >
                                Télécharger
                              </button>
                            )} */}
                              <button
                              type="button"
                              className={`${Styles.btnAdd}`}
                               onClick={() => onModifyExtraCost(ec)}
                            >
                              Modifier
                            </button>
                            {/* <button
                              type="button"
                              className={`${Styles.btn} ${Styles.btnDanger}`}
                              onClick={() => deleteFile(ec.id)}
                            >
                              Supprimer
                            </button> */}
                             
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={Styles.empty}>Aucun frais supplémentaire pour le moment.</p>
            )}
          </div>
        </div>
      ) : 
      (
        <div className={Styles.mainContainer}>
          <div className={Styles.row}>
            
                <input type="text" disabled={true} value={selectedExtraCost.category.name}/>

           
            <input
              type="number"
              name="Valeur du frais"
              placeholder="Montant"
              min={0}
              onChange={(e) => setValue(parseInt(e.target.value))}
              value={value}
            />
          </div>
       

          <div className={Styles.row}>
            <FilesManager
              ref={filesManagerRef}
              interventionId={iv.id}
              type={filesManagerType.INTERVENTIONS}
              onFileSelectedCallback={onFileSelected}
            />
          </div>

          <div className={Styles.rowButtons}>
            <button
              onClick={submit}
              type="button"
              className={` `}
            >
              Enregistrer
            </button>
            <button
              onClick={() => {
                setModificationMode(false);
                setValue(null)
                setFileIsSelected(false);
              }}
              type="button"
              className={`${Styles.btn} ${Styles.btnSecondary}`}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtraCosts;
