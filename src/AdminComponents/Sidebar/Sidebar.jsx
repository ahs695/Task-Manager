import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Auth/authAPI";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEntitiesDropdown, setShowEntitiesDropdown] = useState(false);
  const [showSettingDropdown, setShowSettingDropdown] = useState(false);

  const handleLogout = async () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

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
          Dashboard
        </NavLink>

        <div className={styles.dropdownContainer}>
          {/* Dropdown Header Button */}
          <div
            className={styles.navButton}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <img src="/calenderdb.png" alt="calendar" />
            Schedule
            <img
              src="/down-arrow.png"
              className={`${styles.arrowIcon} ${
                showDropdown ? styles.arrowFlipped : ""
              }`}
              alt="toggle"
            />
          </div>

          {/* Dropdown Items */}
          <div
            className={`${styles.dropdown} ${
              showDropdown ? styles.dropdownShow : styles.dropdownHide
            }`}
          >
            <NavLink
              to="/admin-dashboard/callender"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navButton} ${styles.navButtonActive}`
                  : styles.navButton
              }
              style={{ marginTop: "20px" }}
            >
              <img src="/calenderdb.png" alt="calendar" />
              Calendar
            </NavLink>

            <NavLink
              style={{ marginBottom: "20px" }}
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
          </div>
        </div>

        <div className={styles.dropdownContainer}>
          {/* Entities Dropdown Header */}
          <div
            className={styles.navButton}
            onClick={() => setShowEntitiesDropdown((prev) => !prev)}
          >
            <img src="/projectsdb.png" alt="entities" />
            Entities
            <img
              src="/down-arrow.png"
              className={`${styles.arrowIcon} ${
                showEntitiesDropdown ? styles.arrowFlipped : ""
              }`}
              alt="toggle"
            />
          </div>

          {/* Entities Dropdown Items */}
          <div
            className={`${styles.dropdown} ${
              showEntitiesDropdown ? styles.dropdownShow : styles.dropdownHide
            }`}
          >
            <NavLink
              style={{ marginTop: "20px" }}
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
              to="/admin-dashboard/projects"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navButton} ${styles.navButtonActive}`
                  : styles.navButton
              }
            >
              <img src="/projectsdb.png" alt="projects" />
              Projects
            </NavLink>

            <NavLink
              to="/admin-dashboard/User"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navButton} ${styles.navButtonActive}`
                  : styles.navButton
              }
              style={{ marginBottom: "20px" }}
            >
              <img src="/add-user.png" alt="users" />
              Users
            </NavLink>
          </div>
        </div>
        <div className={styles.dropdownContainer}>
          {/* Entities Dropdown Header */}
          <div
            className={styles.navButton}
            onClick={() => setShowSettingDropdown((prev) => !prev)}
          >
            <img src="/settingdb.png" alt="settings" />
            Settings
            <img
              src="/down-arrow.png"
              className={`${styles.arrowIcon} ${
                showSettingDropdown ? styles.arrowFlipped : ""
              }`}
              alt="toggle"
            />
          </div>

          <div
            className={`${styles.dropdown} ${
              showSettingDropdown ? styles.dropdownShow : styles.dropdownHide
            }`}
          >
            <NavLink
              to="/admin-dashboard/settings"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navButton} ${styles.navButtonActive}`
                  : styles.navButton
              }
              style={{ marginTop: "20px" }}
            >
              <img src="/settingdb.png" alt="prof" />
              My Settings
            </NavLink>
            <NavLink
              to="/admin-dashboard/org-settings"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navButton} ${styles.navButtonActive}`
                  : styles.navButton
              }
              style={{ marginBottom: "20px" }}
            >
              <img src="/settingdb.png" alt="prof" />
              Permissions
            </NavLink>
          </div>
        </div>
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

        <button onClick={handleLogout}>
          {" "}
          <img src="/logoutdb.png" alt="logout" /> Log Out
        </button>
      </div>
    </div>
  );
}
