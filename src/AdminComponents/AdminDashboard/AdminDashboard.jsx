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
import MySettings from "../SettingsPage/MySettings";
import Organization from "../Organization/Organization";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../Redux/Tasks/taskAPI";
import { fetchAllProjects } from "../../Redux/Projects/projectAPI";
import { fetchAllUsers } from "../../Redux/Users/userAPI";
import { fetchTaskAssignments } from "../../Redux/TaskAssignments/taskAssignmentAPI";
import { fetchUnassignedUsers } from "../../Redux/Users/userAPI";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "../../App/Utility/ProtectedRoute";

function Dashboard() {
  const dispatch = useDispatch();
  const { allTasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchAllTasks());
    dispatch(fetchAllProjects());
    dispatch(fetchAllUsers());
    dispatch(fetchTaskAssignments());
    dispatch(fetchUnassignedUsers());
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
            <ProtectedRoute resource="Dashboard">
              <Info
                toDoTasks={toDoTasks}
                inProgressTasks={inProgressTasks}
                underReviewTasks={underReviewTasks}
                completedTasks={completedTasks}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="callender"
          element={
            <ProtectedRoute resource="Calendar">
              <Callender />
            </ProtectedRoute>
          }
        />
        <Route
          path="myTasks"
          element={
            <ProtectedRoute resource="Task">
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="timeline"
          element={
            <ProtectedRoute resource="Timeline">
              <Timeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute resource="Profile">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects"
          element={
            <ProtectedRoute resource="Project">
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="User"
          element={
            <ProtectedRoute resource="User">
              <User />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<MySettings />} />
        <Route path="organizations" element={<Organization />} />
        <Route
          path="org-settings"
          element={
            <ProtectedRoute resource="Setting">
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default Dashboard;
