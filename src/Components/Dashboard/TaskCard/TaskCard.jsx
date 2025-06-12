import React from "react";
import styles from "./TaskCard.module.css";

export default function TaskCard({
  label,
  title,
  description,
  creationTime,
  priority,
  onEdit,
  onDelete,
}) {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskCardTop}>
        <h3>{label}</h3>
        <div className={styles.taskButtons}>
          <img src="/edit.png" alt="Edit" onClick={onEdit} />
          <img src="/delete.png" alt="Delete" onClick={onDelete} />
        </div>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className={styles.taskCardBottom}>
        <div className={styles.creationTime}>
          <p>Created: {creationTime}</p>
        </div>
        <div
          className={`${styles.priority} ${
            priority === "High"
              ? styles.high
              : priority === "Mid"
              ? styles.moderate
              : styles.low
          }`}
        >
          <p>{priority}</p>
        </div>
      </div>
    </div>
  );
}
