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
  onFullView,
}) {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskCardTop}>
        <h4>{label}</h4>
        <div className={styles.taskButtons}>
          <img src="/edit.png" alt="Edit" onClick={onEdit} />
          <img src="/delete.png" alt="Delete" onClick={onDelete} />
        </div>
      </div>
      <div className={styles.taskCardHead}>
        <h2>{title}</h2>
        <button className={styles.viewTask} onClick={onFullView}>
          Full View
        </button>
      </div>

      <p>
        {description.length > 100
          ? description.slice(0, 100) + "..."
          : description}
      </p>

      <div className={styles.taskCardBottom}>
        <div className={styles.creationTime}>
          <p>
            Created:{" "}
            {new Date(creationTime).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
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
