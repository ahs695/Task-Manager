import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Info from "./DashInfo/Info";
import { Routes, Route } from "react-router-dom";
import Callender from "../Callender/Callender";
import MyTasks from "../MyTasks/MyTasks";
import React, { useState } from "react";

function Dashboard() {
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [underReviewTasks, setUnderReviewTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  return (
    <div className={styles.content}>
      <Sidebar></Sidebar>
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
