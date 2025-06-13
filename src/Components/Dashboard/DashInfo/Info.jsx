import React from "react";
import Cards from "../Cards/Cards";
import Tasks from "../Tasks/Tasks";
import styles from "./info.module.css";
import ProfileTab from "./ProfileTab/ProfileTab";
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
  const [dispalyProfile, setDisplayProfile] = useState(false);
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashTop}>
        <h2>Hi, Hadi!</h2>
        <div className={styles.dashOptions}>
          <button className={styles.otherButtons}>
            <img src="/search2.png" alt="" />
          </button>
          <button className={styles.otherButtons}>
            <img src="/notification.png" alt="" />
          </button>
          <img
            className={styles.profilePic}
            src="/profile.png"
            alt=""
            onClick={() => setDisplayProfile(true)}
          />
        </div>
      </div>
      <Cards
        toDoCount={toDoTasks.length}
        inProgressCount={inProgressTasks.length}
        underReviewCount={underReviewTasks.length}
        completedCount={completedTasks.length}
      />
      <Tasks allTasks={allTasks} fetchTasks={fetchTasks} />
      {dispalyProfile && (
        <ProfileTab onClose={() => setDisplayProfile(false)} />
      )}
    </div>
  );
}
