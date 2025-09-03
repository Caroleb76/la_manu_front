import Widget from "../../components/Widget/Widget";
import styles from "./Home.module.css";
import DataGrid from "../../components/DataGrid/DataGrid";
import AlertWidget from "../../components/Widget/AlertWidget/AlertWidget";
import Tasks from "../../components/Widget/Tasks/Tasks";

export default function Home() {
  return (
    <div>
   
      <Widget titre="calendrier" />
      <section className={styles.twoColumnSection}>
        <Widget titre="alertes" > <AlertWidget/></Widget>
        <Widget titre="widget" > <Tasks/></Widget>
      </section>
    </div>
  );
}
