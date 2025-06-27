import React from "react";
import styles from "./TaskCard.module.css";
import { useState, useEffect } from "react";

export default function TaskCard({
  project,
  title,
  priority,
  onEdit,
  onDelete,
  onFullView,
  userName,
  dueDate,
  isCompleted,
  completedAt,
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // updates every minute

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  function getTimeDiff(due, currentTime) {
    let diff = Math.abs(due - currentTime);
    const isPast = due < currentTime;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    return isPast
      ? `Overdue by: ${days}d ${hours}h ${minutes}m`
      : `Time left: ${days}d ${hours}h ${minutes}m`;
  }

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskCardTop}>
        <h4>{project}</h4>
        <div className={styles.taskButtons}>
          <img src="/edit.png" alt="Edit" onClick={onEdit} />
          <img src="/delete.png" alt="Delete" onClick={onDelete} />
        </div>
      </div>
      <div className={styles.taskCardHead}>
        <h3>{title}</h3>
        <button className={styles.viewTask} onClick={onFullView}>
          View
        </button>
      </div>

      <p style={{ color: "orange", fontWeight: "bold" }}>
        Due Date: {dueDate && new Date(dueDate) < new Date() && "⚠️"}
        {dueDate
          ? new Date(dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A"}{" "}
      </p>
      {dueDate && !isCompleted && (
        <p
          style={{
            color: new Date(dueDate) < now ? "orangered" : "lime",
          }}
        >
          {getTimeDiff(new Date(dueDate), now)}
        </p>
      )}

      {isCompleted && completedAt && dueDate && (
        <p
          style={{
            color:
              new Date(completedAt) > new Date(dueDate) ? "orangered" : "lime",
            fontWeight: "bold",
          }}
        >
          {new Date(completedAt) > new Date(dueDate)
            ? " Completed Late"
            : " Completed"}
        </p>
      )}

      <div className={styles.taskCardBottom}>
        <div className={styles.creationTime}>
          <p>{userName}</p>
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
