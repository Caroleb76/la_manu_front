import React from "react";
import styles from "./Widget.module.css";

export default function Widget({ titre, children }) {
  return (
    <div>
      <h2 className="title">{titre}</h2>
      <div className={styles.widgetContent}>
        {children}
      </div>
    </div>
  );
}
