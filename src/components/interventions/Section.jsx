import styles from "./Interventions.module.css";
import InterventionCard from "./InterventionCard";

export default function Section({
  title,
  items,
  onValidateClick,
  disableActions,
  extraCostMode,
  setExtraCostMode,
}) {
  return (
    <section>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className={styles.emptyCard}>Aucune donnée.</div>
      ) : (
        items.map((iv) => (
          <InterventionCard
            disableActions={disableActions}
            onValidateClick={() => onValidateClick(iv)}
            key={iv.id}
            iv={iv}
            extraCostMode={extraCostMode}
            setExtraCostMode={setExtraCostMode}
          />
        ))
      )}
    </section>
  );
}
