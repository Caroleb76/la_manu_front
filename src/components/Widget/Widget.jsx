import React from "react";
import styles from "./Widget.module.css";

export default function Widget({ titre, classString ,children }) {
  return (
    <div className={`${classString}`}>
      <h2 className="title">{titre}</h2>
      <div className={styles.widgetContent}>
        {children}
      </div>
    </div>
  );
}
