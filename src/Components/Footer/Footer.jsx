import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p> &copy; 2025 Divecho Technologies. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
