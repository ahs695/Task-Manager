import React from "react";
import Cards from "../Cards/Cards";
import Tasks from "../Tasks/Tasks";
import styles from "./info.module.css";
import { useState } from "react";

export default function Info({
  toDoTasks,
  setToDoTasks,
  inProgressTasks,
  setInProgressTasks,
  underReviewTasks,
  setUnderReviewTasks,
  completedTasks,
  setCompletedTasks,
  allTasks,
  fetchTasks,
}) {
  const [delCount, setDelCount] = useState(0);
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashTop}>
        <h2>Hi, Hadi!</h2>
        <div className={styles.dashOptions}>
          <button className={styles.otherButtons}>
            <img src="/notification.png" alt="" />
          </button>
        </div>
      </div>
      <Cards
        toDoCount={toDoTasks.length}
        inProgressCount={inProgressTasks.length}
        underReviewCount={underReviewTasks.length}
        completedCount={completedTasks.length}
        delCount={delCount}
      />
      <Tasks
        allTasks={allTasks}
        fetchTasks={fetchTasks}
        setDelCount={setDelCount}
      />
    </div>
  );
}
