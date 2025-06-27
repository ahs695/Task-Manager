import React from "react";
import styles from "./Cards.module.css";
import Chart from "react-apexcharts";
import { format, subDays, isSameDay } from "date-fns";

export default function Cards({
  toDoCount,
  inProgressCount,
  underReviewCount,
  completedCount,
  delCount,
  allProjects,
  allTasks,
}) {
  const today = new Date();
  const last7Days = [...Array(7).keys()].map((i) => subDays(today, 6 - i));

  // X-axis labels
  const dayLabels = last7Days.map((day) => format(day, "EEE")); // ["Mon", "Tue", ...]

  // Task stats per day
  const createdCounts = last7Days.map(
    (day) =>
      allTasks.filter((task) => isSameDay(new Date(task.creationTime), day))
        .length
  );

  const completedCounts = last7Days.map(
    (day) =>
      allTasks.filter(
        (task) =>
          task.completionTime && isSameDay(new Date(task.completionTime), day)
      ).length
  );

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      background: "transparent",
    },
    xaxis: {
      categories: dayLabels,
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#00c4ff", "#00e676"],
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
  };

  const chartSeries = [
    {
      name: "Tasks Created",
      data: createdCounts,
    },
    {
      name: "Tasks Completed",
      data: completedCounts,
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
        </div>
        <progress
          value={
            completedCount /
            (toDoCount + inProgressCount + underReviewCount + completedCount)
          }
        />
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
        <div className={styles.newProj} style={{ backgroundColor: "#A2FFE7" }}>
          <img src="/new-project.png" alt="" />
          <h1>
            {
              allProjects.filter((project) => {
                const created = new Date(project.creationTime);
                const now = new Date();
                return (
                  created.getMonth() === now.getMonth() &&
                  created.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </h1>
          <h3>
            New <br />
            Projects
          </h3>
        </div>
        <div className={styles.progProj} style={{ backgroundColor: "#B5E5FE" }}>
          <img src="/process.png" alt="" />
          <h1>
            {
              allProjects.filter(
                (project) =>
                  project.completionTime === null ||
                  project.completionTime === undefined
              ).length
            }
          </h1>
          <h3>
            Projects <br />
            In Progress
          </h3>
        </div>

        <div className={styles.compProj} style={{ backgroundColor: "#E1DEFF" }}>
          <img src="/done.png" alt="" />
          <h1>
            {
              allProjects.filter((project) => {
                if (!project.completionTime) return false;
                const completed = new Date(project.completionTime);
                const now = new Date();
                return (
                  completed.getMonth() === now.getMonth() &&
                  completed.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </h1>
          <h3>
            Projects <br />
            Completed
          </h3>
        </div>
      </card>
    </div>
  );
}
