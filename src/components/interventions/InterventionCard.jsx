import styles from "./Interventions.module.css";
import StatusPill from "./StatusPill";
import { useState } from "react";
import interventionsHelper from "../../helpers/interventionsHelper";
import { useNotification } from "../../../context/notificationContext";
import PopupWrapper from "../../components/popups/PopupWrapper";
import ExtraCosts from "../extraCosts/ExtraCosts";

function InterventionCard({ iv, onValidateClick, disableActions, extraCostMode, setExtraCostMode }) {
    const monthWithDot = (s) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    const cleanedMonth = (m) => monthWithDot(m.replace(/\.$/, ""));
    const date = new Date(iv.dateIntervention);
    const weekday = monthWithDot(
        date.toLocaleDateString("fr-FR", { weekday: "long" })
    );
    const day = date.toLocaleDateString("fr-FR", { day: "2-digit" });
    const month = cleanedMonth(
        date.toLocaleDateString("fr-FR", { month: "short" })
    );


    const { notify } = useNotification();

    const [confirmValidation, setConfirmValidation] = useState(false);

    const onExtraClick = () => {
        setExtraCostMode(true);
    };

    const displayConfirmationPopup = () => {
        setConfirmValidation(true);
    };
    const validate = async () => {
        const response = await interventionsHelper.validateIntervention(iv.id);
        if (!response?.success) {
            notify(response.message, "error");
            return;
        }
        notify("Intervention validée", "success");
        iv.validatedByFormateur = true;
        onValidateClick();
    };

    return (
        <article className={styles.card}>
            {extraCostMode && (
                <PopupWrapper
                    onClose={() => setExtraCostMode(false)}
                    title="Frais de déplacement"
                >
                    <ExtraCosts iv={iv}></ExtraCosts>
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
                                iv.validatedByAdmin
                                    ? "Validé par l’admin"
                                    : "En attente admin"
                            }
                        />
                    </div>

                    <div className={styles.lowerRightCard}>
                        <button
                            type="button"
                            className={
                                styles.extraBtn +
                                " " +
                                (disableActions ? styles.disabled : "")
                            }
                            onClick={onExtraClick}
                            disabled={disableActions}
                            title="Voir / ajouter des frais annexes"
                        >
                            Frais
                        </button>
                        <button
                            type="button"
                            className={
                                styles.extraBtn +
                                " " +
                                (iv.validatedByFormateur || disableActions
                                    ? styles.disabled
                                    : "")
                            }
                            onClick={displayConfirmationPopup}
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

export default InterventionCard;
