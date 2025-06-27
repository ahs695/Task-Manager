import React from "react";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <img className={styles.homeImg} src="./wtriangle.png" alt="triangles" />
      <div className={styles.welcome}>
        <h1 className={styles.homeTitle}>
          Welcome to
          <br /> Task Manager
        </h1>
        <p className={styles.homeP}>
          Organize <br />
          Manage <br />
          More
        </p>
      </div>
      <img className={styles.homeImg} src="./ptriangle.png" alt="triangles" />
    </div>
  );
}

export default Home;
