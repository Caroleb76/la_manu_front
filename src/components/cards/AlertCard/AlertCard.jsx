import React from "react";
import styles from "./AlertCard.module.css";

export default function AlertCard({ alert }) {
  let priorityClass = "priorityDefault";
  if (alert.priority == 3) {
    priorityClass = styles.priorityLow;
  } else if (alert.priority == 2) {
    priorityClass = styles.priorityMedium;
  } else if (alert.priority == 1) {
    priorityClass = styles.priorityHigh;
  }
  const cardStyle = styles.card + " " + priorityClass;

  return (
    <div className={cardStyle}>
      <div className={styles.title}>
        <h3>{alert.title} </h3>
        <p>{new Date(alert.startDate).toLocaleDateString()}</p>
      </div>
      <div className={styles.content}>
        <p>{alert.content}</p>
      </div>
    </div>
  );
}
