import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
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
          <img src="/calenderdb.png" alt="Callender" />
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
          <img src="/mytasksdb.png" alt="tasks" />
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
          <img src="/timelinedb.png" alt="timeline" />
          Timeline
        </NavLink>
        <NavLink
          to="/dashboard/myFiles"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/documentdb.png" alt="dic" />
          My Tasks
        </NavLink>
      </div>

      <div className={styles.profileOptions}>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/profile.png" alt="prof" />
          Profile
        </NavLink>
        <button>
          {" "}
          <img src="/settingdb.png" alt="" />
          Settings
        </button>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          {" "}
          <img src="/logoutdb.png" alt="logout" /> Log Out
        </button>
      </div>
    </div>
  );
}
