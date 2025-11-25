import styles from "./Interventions.module.css";
import StatusPill from "./StatusPill";
import { useState, useMemo, useCallback} from "react";
import interventionsHelper from "../../helpers/interventionsHelper";
import { useNotification } from "../../../context/notificationContext";
import PopupWrapper from "../../components/popups/PopupWrapper";
import ExtraCosts from "../extraCosts/ExtraCosts";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("fr-FR", { weekday: "long" });
  const day = date.toLocaleDateString("fr-FR", { day: "2-digit" });
  const month = date.toLocaleDateString("fr-FR", { month: "short" }).replace(/\.$/, "");
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    day,
    month: month.charAt(0).toUpperCase() + month.slice(1),
  };
};




// Composant InterventionCard simplifié et mémorisé
export default function InterventionCard({
    iv,
    onValidateClick,
    disableActions,
    extraCostMode,
    setExtraCostMode,
}) {
    // Use formatted date util
    const { weekday, day, month } = useMemo(
        () => formatDate(iv.dateIntervention),
        [iv.dateIntervention]
    );
    const { notify } = useNotification();
    const [confirmValidation, setConfirmValidation] = useState(false);

    const validate = useCallback(async () => {
        const response = await interventionsHelper.validateIntervention(iv.id);
        if (!response?.success) {
            notify(response.message, "error");
            return;
        }
        notify("Intervention validée", "success");
        onValidateClick(iv); // Pass iv up, let parent update immutable state
    }, [iv.id, notify, onValidateClick]);

    return (
        <article className={styles.card}>
            {extraCostMode && (
                <PopupWrapper
                    onClose={() => setExtraCostMode(false)}
                    title="Frais de déplacement"
                >
                    <ExtraCosts iv={iv} />
                </PopupWrapper>
            )}

              {confirmValidation && (
                <PopupWrapper
                    onClose={() => setConfirmValidation(false)}
                    title="Frais de déplacement"
                >
                   <div className={styles.validatePopup__wrapper}>
                        <h1 className={styles.validatePopup__title}>Etes vous certain de vouloir valider cette intervention ?</h1>
                        <p>Veillez à bien renseigner les frais de déplacement avant de valider</p>
                      <div className={styles.validatePopup__btnWrap}>
                            <button className="btn btn-success btn-sm" onClick={validate}>Valider</button>
                            <button className="btn btn-error btn-sm" onClick={() => setConfirmValidation(false)}>Annuler</button>
                      </div>
                   </div>
                </PopupWrapper>
            )}
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
                            <span className={styles.label}>
                                Nombre des heures:
                            </span>{" "}
                            <strong>{Number(iv.hours)} h</strong>
                        </div>
                        <div className={styles.line}>
                            <span className={styles.label}>Catégorie:</span>{" "}
                            <strong>
                                {iv.InterventionCategory?.name ?? "—"}
                            </strong>
                        </div>
                        <div className={styles.line}>
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
                        {/* <StatusPill
                            ok={iv.validatedByAdmin}
                            label="Admin"
                            title={
                                iv.validatedByAdmin
                                    ? "Validé par l’admin"
                                    : "En attente admin"
                            }
                        /> */}
                    </div>
                    <div className={styles.lowerRightCard}>
                        <button
                            type="button"
                            className={`btn btn-primary  ${
                                disableActions ? "btn-disabled" : ""
                            }`}
                            onClick={() => setExtraCostMode(true)}
                            disabled={disableActions}
                            title="Voir / ajouter des frais annexes"
                        >
                            Frais
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary ${
                                iv.validatedByFormateur || disableActions
                                    ? "btn-disabled"
                                    : ""
                            }`}
                            onClick={() => setConfirmValidation(true)}
                            disabled={iv.validatedByFormateur || disableActions}
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
