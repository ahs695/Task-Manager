import React from "react";
import styles from "./Profile.module.css";

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <div className={styles.profileHeader}>
          <img
            src="/profile.png"
            alt="Profile Icon"
            className={styles.profileIcon}
          />
          <h2 className={styles.profileName}>John Doe</h2>
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <label>Full Name</label>
            <p>Johnathan Doe</p>
          </div>
          <div className={styles.detailItem}>
            <label>Position</label>
            <p>User</p>
          </div>
          <div className={styles.detailItem}>
            <label>Email ID</label>
            <p>john@example.com</p>
          </div>
          <div className={styles.detailItem}>
            <label>Password</label>
            <p>••••••••</p>
          </div>
        </div>
        <button className={styles.editProfileButton}>Edit Profile</button>
      </div>
    </div>
  );
}
