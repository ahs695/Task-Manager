import styles from "./AdminDashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Info from "./DashInfo/Info";
import { Routes, Route } from "react-router-dom";
import Callender from "../Callender/Callender";
import MyTasks from "../MyTasks/MyTasks";
import Profile from "../Profile/Profile";
import Settings from "../SettingsPage/Settings";
import Timeline from "../Timeline/Timeline";
import Projects from "../Projects/Projects";
import User from "../User/User";

import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [allTasks, setAllTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [underReviewTasks, setUnderReviewTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [taskAssignments, setTaskAssignments] = useState([]);

  const fetchTasks = async () => {
    try {
      const taskRes = await axios.get("http://localhost:5000/api/tasks");
      const tasks = taskRes.data;
      setAllTasks(tasks);

      // Categorize tasks
      setToDoTasks(tasks.filter((task) => task.category === "todo"));
      setInProgressTasks(
        tasks.filter((task) => task.category === "inprogress")
      );
      setUnderReviewTasks(
        tasks.filter((task) => task.category === "underreview")
      );
      setCompletedTasks(tasks.filter((task) => task.category === "completed"));

      const assignmentRes = await axios.get(
        "http://localhost:5000/api/task-assignments"
      );
      setTaskAssignments(assignmentRes.data);
    } catch (err) {
      console.error("Failed to load tasks or assignments", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth"); // Update route if needed
      setAllUsers(res.data);
      {
        console.log(res);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setAllProjects(res.data);
      {
        console.log(res);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects();
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
              allUsers={allUsers}
              allProjects={allProjects}
            />
          }
        />
        <Route
          path="callender"
          element={
            <Callender
              allTasks={allTasks}
              allProjects={allProjects}
              taskAssignments={taskAssignments}
            />
          }
        />
        <Route
          path="myTasks"
          element={
            <MyTasks
              allTasks={allTasks}
              allUsers={allUsers}
              fetchTasks={fetchTasks}
              allProjects={allProjects}
              taskAssignments={taskAssignments}
            />
          }
        />
        <Route path="timeline" element={<Timeline allTasks={allTasks} />} />
        <Route
          path="profile"
          element={
            <Profile
              allUsers={allUsers}
              allTasks={allTasks}
              allProjects={allProjects}
            />
          }
        />
        <Route
          path="projects"
          element={
            <Projects
              allProjects={allProjects}
              fetchProjects={fetchProjects}
              allUsers={allUsers}
              allTasks={allTasks}
              taskAssignments={taskAssignments}
            />
          }
        />
        <Route
          path="User"
          element={
            <User
              allUsers={allUsers}
              fetchUsers={fetchUsers}
              allProjects={allProjects}
              taskAssignments={taskAssignments}
            />
          }
        />
        <Route path="Settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
