import styles from "./Interventions.module.css";

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

export default StatusPill;