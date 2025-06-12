import React, { useState, useEffect } from "react";
import styles from "./MyTasks.module.css";
import Filter from "./Filter/Filter";

export default function MyTasks({ allTasks }) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(allTasks);
  const [intermediateTasks, setIntermediateTasks] = useState(allTasks); // holds tasks after filter but before search

  // Filter tasks by title based on searchQuery
  useEffect(() => {
    const searched = intermediateTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(searched);
  }, [searchQuery, intermediateTasks]);

  return (
    <div className={styles.myTasks}>
      <div className={styles.myTasksTop}>
        <h1>My Tasks</h1>
        <div className={styles.taskOptions}>
          <div className={styles.taskOption}>
            <img src="/searchab.png" alt="" />
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={styles.taskOption}
            onClick={() => setShowFilter(!showFilter)}
          >
            <img src="/filterab.png" alt="" />
            Filter
          </button>
        </div>
      </div>

      <div className={styles.myTasksData}>
        <table className={styles.myTasksTable}>
          <thead>
            <tr>
              <th>Created</th>
              <th>Label</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={index}>
                <td>
                  {new Date(task.creationTime).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>{task.label}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFilter && (
        <Filter
          allTasks={allTasks}
          setFilteredTasks={setIntermediateTasks} // filter goes here first
          onCloseTab={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
