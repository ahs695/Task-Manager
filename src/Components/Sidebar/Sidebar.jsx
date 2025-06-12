import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
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

        {/* Keep the rest as normal buttons for now */}

        <button className={styles.navButton}>
          <img src="/static.png" alt="" />
          Static's
        </button>
        <button className={styles.navButton}>
          <img src="/doc.png" alt="" />
          Document
        </button>
      </div>

      <div className={styles.teams}>
        <p>
          <b>Teams:</b>
        </p>
        <button className={styles.teamButton}>Marketing</button>
        <button className={styles.teamButton}>Sales</button>
        <button className={styles.teamButton}>Development</button>
      </div>
    </div>
  );
}
