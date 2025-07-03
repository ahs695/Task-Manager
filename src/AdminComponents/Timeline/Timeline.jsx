import React from "react";
import Chart from "react-apexcharts";
import styles from "./Timeline.module.css";
import { useSelector, useDispatch } from "react-redux";

export default function Timeline() {
  const allTasks = useSelector((state) => state.tasks.allTasks);
  const createdToStarted = [];
  const startedToReview = [];
  const reviewToCompleted = [];

  allTasks.forEach((task) => {
    const taskTitle = task.title || "Untitled";

    // 1. Created → Started
    if (task.creationTime && task.startedTime) {
      createdToStarted.push({
        x: taskTitle,
        y: [
          new Date(task.creationTime).getTime(),
          new Date(task.startedTime).getTime(),
        ],
      });
    }

    // 2. Started → Review
    if (task.startedTime && task.reviewTime) {
      startedToReview.push({
        x: taskTitle,
        y: [
          new Date(task.startedTime).getTime(),
          new Date(task.reviewTime).getTime(),
        ],
      });
    }

    // 3. Review → Completed
    if (task.reviewTime && task.completionTime) {
      reviewToCompleted.push({
        x: taskTitle,
        y: [
          new Date(task.reviewTime).getTime(),
          new Date(task.completionTime).getTime(),
        ],
      });
    }
  });

  const chartOptions = {
    chart: {
      type: "rangeBar",
      height: 500,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
    },
    title: {
      text: "Task Timeline",
      align: "left",
    },
    colors: ["#1abc9c", "#3498db", "#9b59b6"], // Three colors for three ranges
  };

  const chartSeries = [
    {
      name: "Created → Started",
      data: createdToStarted,
    },
    {
      name: "Started → Review",
      data: startedToReview,
    },
    {
      name: "Review → Completed",
      data: reviewToCompleted,
    },
  ];

  return (
    <div className={styles.timeline}>
      <h1>Task Timeline</h1>
      <Chart options={chartOptions} series={chartSeries} type="rangeBar" />
    </div>
  );
}
