import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "./Interventions.module.css";
import { UserContext } from "../../../context/userContext";
import contractsHelper from "../../helpers/contractsHelper";
import interventionsHelper from "../../helpers/interventionsHelper";
import { useNotification } from "../../../context/notificationContext";
import PopupWrapper from "../../components/popups/PopupWrapper";
import formationHelper from "../../helpers/formationHelper";
import Section from "../../components/interventions/Section"; 


// creation of the date in text (in french format)
const frDateLong = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


const sumHours = (items) =>
  items.reduce((acc, it) => acc + Number(it.hours || 0), 0);

const monthWithDot = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const cleanedMonth = (m) => monthWithDot(m.replace(/\.$/, ""));

export default function Interventions() {
  const [interventions, setInterventions] = useState([]);
  // const [contracts, setContracts] = useState([]);
  // const [selectedContractId, setSelectedContractId] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formations, setFormations] = useState([]);
      const [extraCostMode, setExtraCostMode] = useState(false);

  const [confirmValidation, setConfirmValidation] = useState(false);

useEffect(() => {
  let ignore = false;

  (async () => {
    
    setLoading(true);
    try {

      const res = await formationHelper.allFormationByFormateurId(user.id);
   
      setFormations(res?.data ?? []);
      if (ignore) return;
      setSelectedFormation(res?.data[0]);
      calculateStats();
    } catch (e) {
      console.error(e);
    } finally {
      if (!ignore) setLoading(false);
    }
  })();

  return () => { ignore = true; };

}, [user.id, user.isAdmin]);


useEffect(() => {
  console.log("selectedFormation", selectedFormation);
  
  if (!selectedFormation) {
    setInterventions([]);
    return;
  }

  let ignore = false;

  (async () => {
    try {
      const res = await interventionsHelper.getByFormationAndUserId(selectedFormation.id,user.id);
      if (!ignore) setInterventions(res?.data ?? []);
    } catch (e) {
      console.error(e);
      if (!ignore) setInterventions([]);
    }
  })();

  return () => { ignore = true; };
}, [selectedFormation]);


useEffect(() => {
  if (interventions && interventions.length > 0) {
    calculateStats();
  }
}, [interventions]);

function calculateStats() {

}
  const today = new Date();


  const filtered = useMemo(() => interventions, [interventions, selectedFormation]);

  const { validated, coming, pending } = useMemo(() => {
    const p = [];
    const c = [];
    const v = [];
    
    
    filtered?.forEach((iv) => {
      const d = new Date(iv.dateIntervention);
      if (d < today && !iv.validatedByFormateur) p.push(iv);
      else if (d > today) c.push(iv);
      else if (iv.validatedByFormateur && d < today) v.push(iv);
    });
    c.sort((a, b) => new Date(a.dateIntervention) - new Date(b.dateIntervention));
    v.sort((a, b) => new Date(b.dateIntervention) - new Date(a.dateIntervention));
    return { pending: p, coming: c, validated: v };
  }, [filtered]);
 
const onInterventionValidated = (iv) => {
            setInterventions(prev => {
            return prev.map(p => {
              if(p.id === iv.id){
                return {...p, validatedByFormateur: true}
              }
              return p;
            })
          });
};



  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
           {confirmValidation &&
         <PopupWrapper onClose={() => setExtraCostMode(false)} title="Frais de déplacement">
          <p>TEST</p>
          <button>TEST</button>
        </PopupWrapper>
      }
          <h1 className={styles.title}>{selectedFormation?.name || "Formation"}</h1>
          <div className={styles.metaRow}>
            <span >
              Interventions Validées: <strong>{validated?.length}</strong> / {interventions?.length}
            </span>
                      <div className={styles.badgeRow}>
            <span className={styles.badgeInfo}>
              Heures totales: {sumHours(filtered)} h
            </span>
          </div>
          </div>
        </div>


        <div className={styles.selectWrap}>
          <select
            id="formationSelect"
            className={styles.select}
            value={selectedFormation?.id}
            onChange={(e) =>{
              setSelectedFormation(formations.find(f => f.id === e.target.value));
            }}
          >
            {formations?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <div className={styles.loading}>Chargement…</div>
      ) : (
        <div className={styles.sections}>
          {
            pending.length > 0 &&
            <Section title="interventions passées à valider ⚠️" items={pending}  onValidateClick={onInterventionValidated} disableActions={false}/>
          }
          <Section title="Interventions à venir" disableActions={true} items={coming} onValidateClick={onInterventionValidated}/>
          <Section title="intervention validées"  disableActions={true} items={validated} onValidateClick={onInterventionValidated}/>
        </div>
      )}

 
    </div>
  );
}

// small components




