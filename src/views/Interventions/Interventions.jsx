import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "./Interventions.module.css";
import { UserContext } from "../../../context/userContext";
import contractsHelper from "../../helpers/contractsHelper";
import interventionsHelper from "../../helpers/interventionsHelper";
import { useNotification } from "../../../context/notificationContext";
import { set } from "zod/v4-mini";
import PopupWrapper from "../../components/popups/PopupWrapper";
import ExtraConsts from "../../components/extraCosts/ExtraCosts";


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
  const [contracts, setContracts] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [selectedFormation, setSelectedFormation] = useState(null);


useEffect(() => {
  let ignore = false;

  (async () => {
    setLoading(true);
    try {
      const filter = !user.isAdmin ? JSON.stringify({ userId: user.id }) : undefined;
      const res = await contractsHelper.getContracts(0, 1000, "", filter);
      const list = res?.data?.contracts ?? [];

      if (ignore) return;

      setContracts(list);

      const firstId = list[0]?.id ?? "";
      setSelectedContractId(firstId);
      setSelectedFormation(list[0].SessionFormation.Formation);
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
  if (!selectedContractId) {
    setInterventions([]);
    return;
  }

  let ignore = false;

  (async () => {
    try {
      const res = await interventionsHelper.getInterventionsByContractId(selectedContractId);
      if (!ignore) setInterventions(res?.data ?? []);
    } catch (e) {
      console.error(e);
      if (!ignore) setInterventions([]);
    }
  })();

  return () => { ignore = true; };
}, [selectedContractId]);


useEffect(() => {
  if (interventions && interventions.length > 0) {
    calculateStats();
  }
}, [interventions]);

function calculateStats() {

}
  const today = new Date();


  const filtered = useMemo(() => {
    return selectedContractId
      ? interventions?.filter((i) => i.contractId === selectedContractId)
      : interventions;
  }, [interventions, selectedContractId]);

  const { validated, coming, pending } = useMemo(() => {
    const p = [];
    const c = [];
    const v = [];
    console.log("filtered", filtered);
    console.log(selectedContractId);
    
    
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
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
          >
            {contracts?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.SessionFormation.Formation.name}
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
            <Section title="interventions passées à valider ⚠️" items={pending}  onValidateClick={onInterventionValidated}/>
          }
          <Section title="Interventions à venir" items={coming} onValidateClick={onInterventionValidated}/>
          <Section title="intervention validées" items={validated} onValidateClick={onInterventionValidated}/>
        </div>
      )}

 
    </div>
  );
}

// small components
function Section({ title, items, onValidateClick }) {
  return (
    <section>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className={styles.emptyCard}>Aucune donnée.</div>
      ) : (
        items.map((iv) => <InterventionCard onValidateClick={()=>onValidateClick(iv)} key={iv.id} iv={iv} />)
      )}
    </section>
  );
}

function InterventionCard({ iv ,onValidateClick}) {
  const date = new Date(iv.dateIntervention);
  const weekday = monthWithDot(date.toLocaleDateString("fr-FR", { weekday: "long" }));
  const day = date.toLocaleDateString("fr-FR", { day: "2-digit" });
  const month = cleanedMonth(date.toLocaleDateString("fr-FR", { month: "short" }));
  const {notify} = useNotification();
  const [extraCostMode, setExtraCostMode] = useState(false);
  const onExtraClick = () => {
    setExtraCostMode(true);
  };

    const validate = async () => {

    const response = await interventionsHelper.validateIntervention(iv.id);
    if(!response?.success){
      notify(response.message, "error");
      return
    }
    notify("Intervention validée", "success");
    iv.validatedByFormateur = true;
    onValidateClick();
  };

  return (
    <article className={styles.card}>
      {
        extraCostMode &&
        <PopupWrapper onClose={() => setExtraCostMode(false)} title="Frais additionnels" children={<ExtraConsts iv={iv}></ExtraConsts>}>
        </PopupWrapper>
      }
      <div className={styles.cardMain}>
        <div className={styles.cardLeft}>

          <div className={styles.dateBox}>
            <div className={styles.weekday}>{weekday}</div>
            <div className={styles.dayMonth}>
              {day} {month}
            </div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.line}>
              <span className={styles.label}>Nombre des heures:</span>{" "}
              <strong>{Number(iv.hours)} h</strong>
            </div>
            <div className={styles.line}>
              <span className={styles.label}>Catégorie:</span>{" "}
              <strong>{iv.InterventionCategory?.name ?? "—"}</strong>
            </div>
            <div className={styles.line}>
              <span className={styles.label}></span>{" "}
              <span>{iv.shift.toUpperCase() || "—"}</span>
            </div>
          </div>
        </div>

        <div className={styles.cardRight}>
          <div className={styles.upperRightCard}>
            <StatusPill
              ok={iv.validatedByFormateur}
              label="Formateur"
              title={
                iv.validatedByFormateur
                  ? "Validé par le formateur"
                  : "En attente formateur"
              }
            />
            <StatusPill
              ok={iv.validatedByAdmin}
              label="Admin"
              title={
                iv.validatedByAdmin ? "Validé par l’admin" : "En attente admin"
              }
            />
          </div>

          <div className={styles.lowerRightCard}>

            <button
              type="button"
              className={styles.extraBtn}
              onClick={onExtraClick}
              title="Voir / ajouter des frais annexes"
            >
              Frais
            </button>
                       <button
              type="button"
              className={styles.extraBtn + " " + (iv.validatedByFormateur ? styles.disabled : "")}
              onClick={validate}
              disabled={iv.validatedByFormateur}
              title="Valider l’intervention"
            >
              {iv.validatedByFormateur ? "Valide" : "Valider"}
            </button>
          </div>
        </div>
      </div>

      {iv.description && (
        <p className={styles.description}>{iv.description}</p>
      )}
    </article>
  );
}

function StatusPill({ ok, label, title }) {
  return (
    <span
      className={`${styles.status} ${ok ? styles.ok : styles.waiting}`}
      title={title}
      aria-label={`${label}: ${ok ? "validé" : "en attente"}`}
    >
      <span className={styles.statusDot} />
      {label}
    </span>
  );
}
