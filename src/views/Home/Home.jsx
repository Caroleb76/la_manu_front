import Widget from "../../components/Widget/Widget";
import styles from "./Home.module.css";
import DataGrid from "../../components/DataGrid";

export default function Home() {
  return (
    <div>
      <Widget titre="calendrier" />
      <section className={styles.twoColumnSection}>
        <Widget titre="alertes" />
        <Widget titre="widget" />
      </section>
    </div>
  );
}
