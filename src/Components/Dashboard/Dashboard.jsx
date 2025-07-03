import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Info from "./DashInfo/Info";
import { Routes, Route } from "react-router-dom";
import Callender from "../Callender/Callender";
import MyTasks from "../MyTasks/MyTasks";
import Projects from "../Projects/Projects";
import Profile from "../Profile/Profile";
import Timeline from "../Timeline/Timeline";
import MyFiles from "../MyFiles/MyFiles";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../Redux/Tasks/taskAPI";
import { fetchAllProjects } from "../../Redux/Projects/projectAPI";
import { fetchAllUsers } from "../../Redux/Users/userAPI";
import { fetchTaskAssignments } from "../../Redux/TaskAssignments/taskAssignmentAPI";

function Dashboard() {
  const dispatch = useDispatch();
  const { allTasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchAllTasks());
    dispatch(fetchAllProjects());
    dispatch(fetchAllUsers());
    dispatch(fetchTaskAssignments());
  }, [dispatch]);

  const toDoTasks = allTasks.filter((task) => task.category === "todo");
  const inProgressTasks = allTasks.filter(
    (task) => task.category === "inprogress"
  );
  const underReviewTasks = allTasks.filter(
    (task) => task.category === "underreview"
  );
  const completedTasks = allTasks.filter(
    (task) => task.category === "completed"
  );

  return (
    <div className={styles.content}>
      <Sidebar />
      <Routes>
        <Route
          path="info"
          element={
            <Info
              toDoTasks={toDoTasks}
              inProgressTasks={inProgressTasks}
              underReviewTasks={underReviewTasks}
              completedTasks={completedTasks}
              allTasks={allTasks}
            />
          }
        />
        <Route path="callender" element={<Callender />} />
        <Route path="myTasks" element={<MyTasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="timeline" element={<Timeline allTasks={allTasks} />} />
        <Route path="profile" element={<Profile />} />
        <Route path="myFiles" element={<MyFiles />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
