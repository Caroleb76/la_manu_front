import styles from "./StatsWidget.module.css";
export default function StatWidgetWrapper({ title, children }) {
  return (
    <div className={styles.statSection}>
      <h1 className={styles.statTitle}>{title}</h1>
      <div className={styles.statContent}>{children}</div>
    </div>
  );
}
