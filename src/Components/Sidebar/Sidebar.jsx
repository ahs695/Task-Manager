import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import ProfileTab from "./ProfileTab/ProfileTab";
import { useState } from "react";

export default function Sidebar() {
  const [dispalyProfile, setDisplayProfile] = useState(false);
  return (
    <div className={styles.sidebar}>
      <div className={styles.nav}>
        <NavLink
          to="/dashboard/info"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/dashboard.png" alt="Dash" />
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/callender"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/callender.png" alt="Callender" />
          Calender
        </NavLink>

        <NavLink
          to="/dashboard/myTasks"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/tasks.png" alt="tasks" />
          My Tasks
        </NavLink>
        <NavLink
          to="/dashboard/timeline"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/static.png" alt="timeline" />
          Timeline
        </NavLink>

        {/* Keep the rest as normal buttons for now */}

        <button className={styles.navButton}>
          <img src="/doc.png" alt="" />
          Document
        </button>
      </div>

      <button
        className={styles.profileTabButton}
        onClick={() => setDisplayProfile(true)}
      >
        <img className={styles.profilePic} src="/profile.png" alt="" />
        Profile
      </button>

      {dispalyProfile && (
        <ProfileTab onClose={() => setDisplayProfile(false)} />
      )}
    </div>
  );
}
