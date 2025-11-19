import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import styles from "./Interventions.module.css";
import { UserContext } from "../../../context/userContext";
import interventionsHelper from "../../helpers/interventionsHelper";
import { useNotification } from "../../../context/notificationContext";
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
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formations, setFormations] = useState([]);
  const [extraCostMode, setExtraCostMode] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await formationHelper.allFormationByFormateurId(user.id);
        if (ignore) return;
        setFormations(res?.data ?? []);
        setSelectedFormation(res?.data[0] ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [user.id]);

  useEffect(() => {
    if (!selectedFormation) {
      setInterventions([]);
      return;
    }
    let ignore = false;
    (async () => {
      try {
        const res = await interventionsHelper.getByFormationAndUserId(
          selectedFormation.id,
          user.id,
        );
        if (!ignore) setInterventions(res?.data ?? []);
      } catch (e) {
        console.error(e);
        if (!ignore) setInterventions([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [selectedFormation]);

  const onInterventionValidated = useCallback((intervention) => {
    setInterventions((prevArray) =>
      prevArray.map((prev) =>
        prev.id === intervention.id
          ? { ...prev, validatedByFormateur: true }
          : prev,
      ),
    );
  }, []);

  const today = useMemo(() => new Date(), []);

  const filtered = useMemo(() => interventions, [interventions]);
  const { validated, coming, pending } = useMemo(() => {
    const pending = [];
    const coming = [];
    const validated = [];

    filtered.forEach((intervention) => {
      const date = new Date(intervention.dateIntervention);
      if (date < today && !intervention.validatedByFormateur)
        pending.push(intervention);
      else if (date > today) coming.push(intervention);
      else if (intervention.validatedByFormateur && date < today)
        validated.push(intervention);
    });

    coming.sort(
      (a, b) => new Date(a.dateIntervention) - new Date(b.dateIntervention),
    );

    validated.sort(
      (a, b) => new Date(b.dateIntervention) - new Date(a.dateIntervention),
    );
    return { pending, coming, validated };
  }, [filtered, today]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {selectedFormation?.name || "Formation"}
          </h1>
          <div className={styles.metaRow}>
            <span>
              Interventions Validées: <strong>{validated.length}</strong> /{" "}
              {interventions.length}
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
            value={selectedFormation?.id || ""}
            onChange={(e) =>
              setSelectedFormation(
                formations.find((f) => f.id === e.target.value),
              )
            }
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
          {pending.length > 0 && (
            <Section
              title="interventions passées à valider ⚠️"
              items={pending}
              onValidateClick={onInterventionValidated}
              disableActions={false}
              extraCostMode={extraCostMode}
              setExtraCostMode={setExtraCostMode}
            />
          )}

          <Section
            title="Interventions à venir"
            disableActions={true}
            items={coming}
            onValidateClick={onInterventionValidated}
            extraCostMode={extraCostMode}
            setExtraCostMode={setExtraCostMode}
          />

          <Section
            title="intervention validées"
            disableActions={true}
            items={validated}
            onValidateClick={onInterventionValidated}
            extraCostMode={extraCostMode}
            setExtraCostMode={setExtraCostMode}
          />
        </div>
      )}
    </div>
  );
}
