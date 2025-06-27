import React from "react";
import styles from "./Profile.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import CreateOrEditUser from "../User/CreateUser/CreateOrEditUser";

export default function Profile({ allUsers, allTasks, allProjects }) {
  const { auth } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  if (!auth?.token) {
    return <div className={styles.profileContainer}>Not logged in.</div>;
  }

  const decoded = jwtDecode(auth.token);
  const userId = decoded.id;
  const role = decoded.role;

  const user = allUsers.find((u) => u._id === userId);

  if (!user) {
    return <div className={styles.profileContainer}>User not found.</div>;
  }

  // Filter tasks assigned to this user
  const userTasks = allTasks.filter((task) => task.user === userId);

  // Task counts
  const taskStats = {
    total: userTasks.length,
    ongoing: userTasks.filter((task) =>
      ["inprogress", "underreview"].includes(task.category)
    ).length,
    completed: userTasks.filter((task) => task.category === "completed").length,
  };

  // Get project IDs from tasks where this user is assigned
  const userProjectIds = [
    ...new Set(userTasks.map((task) => task.project?.toString())),
  ];

  // Filter projects the user is involved in
  const userProjects = allProjects.filter((project) =>
    userProjectIds.includes(project._id.toString())
  );

  // Project stats using completionTime
  const projectStats = {
    total: userProjects.length,
    completed: userProjects.filter((project) => !!project.completionTime)
      .length,
    ongoing: userProjects.filter((project) => !project.completionTime).length,
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <div className={styles.profileHeader}>
          <img
            src="/profile.png"
            alt="Profile Icon"
            className={styles.profileIcon}
          />
          <h2 className={styles.profileName}>{user.name}</h2>
        </div>
        <hr />
        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <label>Full Name</label>
            <p>{user.name}</p>
          </div>

          <div className={styles.detailItem}>
            <label>Email ID</label>
            <p>{user.email}</p>
          </div>
          <div className={styles.detailItem}>
            <label>Position</label>
            <p>{role}</p>
          </div>
        </div>
      </div>

      <div className={styles.editProfile}>
        <h1 className={styles.header}>My All Time Insights</h1>
        <div className={styles.insightContainer}>
          <div className={styles.taskData}>
            <h3>Tasks</h3>
            <div
              className={styles.newProj}
              style={{ backgroundColor: "#A2FFE7" }}
            >
              <img src="/new-project.png" alt="total tasks" />
              <h1>{taskStats.total}</h1>
              <h3>Total</h3>
            </div>
            <div
              className={styles.progProj}
              style={{ backgroundColor: "#B5E5FE" }}
            >
              <img src="/process.png" alt="ongoing tasks" />
              <h1>{taskStats.ongoing}</h1>
              <h3>Ongoing</h3>
            </div>
            <div
              className={styles.compProj}
              style={{ backgroundColor: "#E1DEFF" }}
            >
              <img src="/done.png" alt="completed tasks" />
              <h1>{taskStats.completed}</h1>
              <h3>Completed</h3>
            </div>
          </div>

          <div className={styles.projectData}>
            <h3>Projects</h3>
            <div
              className={styles.newProj}
              style={{ backgroundColor: "#A2FFE7" }}
            >
              <img src="/new-project.png" alt="total projects" />
              <h1>{projectStats.total}</h1>
              <h3>Total</h3>
            </div>
            <div
              className={styles.progProj}
              style={{ backgroundColor: "#B5E5FE" }}
            >
              <img src="/process.png" alt="ongoing projects" />
              <h1>{projectStats.ongoing}</h1>
              <h3>Ongoing</h3>
            </div>
            <div
              className={styles.compProj}
              style={{ backgroundColor: "#E1DEFF" }}
            >
              <img src="/done.png" alt="completed projects" />
              <h1>{projectStats.completed}</h1>
              <h3>Completed</h3>
            </div>
          </div>
        </div>

        <button
          className={styles.editProfileButton}
          onClick={() => setShowEditProfile(true)}
        >
          Edit Profile
        </button>
      </div>
      {showEditProfile && (
        <CreateOrEditUser
          editUser={user}
          fetchUsers={() => {}} // or pass a refetch function if needed
          onCloseTab={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
}
