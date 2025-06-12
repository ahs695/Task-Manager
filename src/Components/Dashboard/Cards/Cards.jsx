import React from "react";
import styles from "./Cards.module.css";
import Chart from "react-apexcharts";

export default function Cards({
  toDoCount,
  inProgressCount,
  underReviewCount,
  completedCount,
  delCount,
}) {
  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["aliceblue"],
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)", // optional: lighter grid
    },
  };

  const chartSeries = [
    {
      name: "Tasks Completed",
      data: [10, 20, 15, 30, 25],
      color: "white",
    },
  ];

  return (
    <div className={styles.cardContainer}>
      <card className={styles.infoCard}>
        <h3>Overall Information</h3>
        <div className={styles.infoData}>
          <h2>
            {delCount +
              toDoCount +
              inProgressCount +
              underReviewCount +
              completedCount}
          </h2>
          <p>
            {" "}
            Task added <br />
            for all time
          </p>
          <p>-</p>
          <h2>{delCount}</h2>
          <p>
            {" "}
            Projects <br />
            Deleted
          </p>
        </div>
        <progress value={0.5} />
        <div className={styles.stats}>
          <div className={styles.stat} style={{ backgroundColor: "#B5E5FE" }}>
            <img src="/inprogress.png" alt="" />
            <h2>{inProgressCount}</h2>
            <p>In Progress</p>
          </div>
          <div className={styles.stat} style={{ backgroundColor: "#A2FFE7" }}>
            <img src="/process.png" alt="" />
            <h2>{underReviewCount}</h2>
            <p>In Review</p>
          </div>
          <div className={styles.stat} style={{ backgroundColor: "#E1DEFF" }}>
            <img src="/completed.png" alt="" />
            <h2>{completedCount}</h2>
            <p>Complete</p>
          </div>
        </div>
      </card>
      <card className={styles.processCard}>
        <h3 style={{ color: "aliceblue" }}>Weekly Progress</h3>
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={200}
          />
        </div>
      </card>
      <card className={styles.progressCard}>
        <h3>Monthly Progress</h3>
      </card>
    </div>
  );
}
