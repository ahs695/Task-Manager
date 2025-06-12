import React from "react";
import styles from "./ProfileTab.module.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProfileTab({ onClose }) {
  const navigate = useNavigate();
  const handleOverlayClick = () => {
    onClose(); // Close when clicking on overlay
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent click from reaching overlay
  };
  return (
    <div className={styles.profileOverlay} onClick={handleOverlayClick}>
      <div className={styles.profileSidebar} onClick={stopPropagation}>
        <div className={styles.profileTop}>
          <img src="/profile.png" alt="prof" />
          <h2>Hadi</h2>
        </div>
        <div className={styles.profileOptions}>
          <button>
            {" "}
            <img src="/profileab.png" alt="" /> View Profile
          </button>
          <button>
            {" "}
            <img src="/setting.png" alt="" />
            Account Settings
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            {" "}
            <img src="/logout.png" alt="logout" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
