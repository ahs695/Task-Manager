import React from "react";
import styles from "./MyTasks.module.css";

export default function MyTasks({
  toDoTasks,
  inProgressTasks,
  underReviewTasks,
  completedTasks,
}) {
  const allTasks = [
    ...toDoTasks.map((task) => ({ ...task, label: "To Do" })),
    ...inProgressTasks.map((task) => ({ ...task, label: "In Progress" })),
    ...underReviewTasks.map((task) => ({ ...task, label: "Under Review" })),
    ...completedTasks.map((task) => ({ ...task, label: "Completed" })),
  ];
  return (
    <div className={styles.myTasks}>
      <div className={styles.myTasksTop}>
        <h1>My Tasks</h1>
        <div className={styles.taskOptions}>
          <button className={styles.taskOption}>
            <img src="/searchab.png" alt="" />
            <input type="text" placeholder="Search" />
          </button>
          <button className={styles.taskOption}>
            <img src="/filterab.png" alt="" />
            Filter
          </button>
        </div>
      </div>
      <div className={styles.myTasksData}>
        <table className={styles.myTasksTable}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Label</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map((task, index) => (
              <tr key={index}>
                <td>{task.creationTime}</td>
                <td>{task.label}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
