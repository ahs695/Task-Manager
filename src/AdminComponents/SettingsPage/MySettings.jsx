import React, { useEffect, useState } from "react";
import styles from "./MySettings.module.css";

export default function MySettings() {
  return (
    <div className={styles.mySettingsContainer}>
      <div className={styles.mySettings}>
        <h1>My Settings</h1>
      </div>
    </div>
  );
}
