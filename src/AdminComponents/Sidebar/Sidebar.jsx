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
          onClick={() => {
            console.log("Auth context:", auth);
          }}
          to="/admin-dashboard/info"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/dashboard.png" alt="Dash" />
          Admin Dashboard
        </NavLink>

        <NavLink
          to="/admin-dashboard/callender"
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
          to="/admin-dashboard/myTasks"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/mytasksdb.png" alt="tasks" />
          All Tasks
        </NavLink>
        <NavLink
          to="/admin-dashboard/timeline"
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
          to="/admin-dashboard/projects"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/projectsdb.png" alt="dic" />
          Projects
        </NavLink>
        <NavLink
          to="/admin-dashboard/User"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/add-user.png" alt="dic" />
          Users
        </NavLink>
      </div>

      <div className={styles.profileOptions}>
        <NavLink
          to="/admin-dashboard/profile"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/profile.png" alt="prof" />
          Profile
        </NavLink>
        <NavLink
          to="/admin-dashboard/Settings"
          className={({ isActive }) =>
            isActive
              ? `${styles.navButton} ${styles.navButtonActive}`
              : styles.navButton
          }
        >
          <img src="/settingdb.png" alt="prof" />
          Settings
        </NavLink>

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
