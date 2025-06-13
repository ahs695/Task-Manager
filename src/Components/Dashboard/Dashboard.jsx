import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Info from "./DashInfo/Info";
import { Routes, Route } from "react-router-dom";
import Callender from "../Callender/Callender";
import MyTasks from "../MyTasks/MyTasks";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [allTasks, setAllTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [underReviewTasks, setUnderReviewTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      const tasks = res.data;
      setAllTasks(tasks);

      // Set category-specific states
      setToDoTasks(tasks.filter((task) => task.category === "todo"));
      setInProgressTasks(
        tasks.filter((task) => task.category === "inprogress")
      );
      setUnderReviewTasks(
        tasks.filter((task) => task.category === "underreview")
      );
      setCompletedTasks(tasks.filter((task) => task.category === "completed"));
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={styles.content}>
      <Sidebar />
      <Routes>
        <Route
          path="info"
          element={
            <Info
              toDoTasks={toDoTasks}
              setToDoTasks={setToDoTasks}
              inProgressTasks={inProgressTasks}
              setInProgressTasks={setInProgressTasks}
              underReviewTasks={underReviewTasks}
              setUnderReviewTasks={setUnderReviewTasks}
              completedTasks={completedTasks}
              setCompletedTasks={setCompletedTasks}
              allTasks={allTasks}
              fetchTasks={fetchTasks}
            />
          }
        />
        <Route path="callender" element={<Callender />} />
        <Route
          path="myTasks"
          element={
            <MyTasks
              toDoTasks={toDoTasks}
              inProgressTasks={inProgressTasks}
              underReviewTasks={underReviewTasks}
              completedTasks={completedTasks}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default Dashboard;
