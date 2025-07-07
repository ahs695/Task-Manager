import React, { useState } from "react";
import Cards from "../Cards/Cards";
import Tasks from "../Tasks/Tasks";
import styles from "./info.module.css";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

export default function Info({
  toDoTasks,
  inProgressTasks,
  underReviewTasks,
  completedTasks,
}) {
  const [delCount, setDelCount] = useState(0);
  const auth = useSelector((state) => state.auth);
  const decoded = jwtDecode(auth.token);
  const role = decoded.role;
  const { token } = useSelector((state) => state.auth);
  const allUsers = useSelector((state) => state.users.allUsers);

  let name = "Admin";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const user = allUsers.find((u) => u._id === decoded.id);
      if (user) {
        name = user.name;
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  // Check if role is admin or superAdmin
  const shouldShowCards =
    role === "admin" || role === "superAdmin" || role === "organization";

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashTop}>
        <h2>Hi, {name}!</h2>
        <div className={styles.dashOptions}>
          <button className={styles.otherButtons}>
            <img src="/notification.png" alt="" />
          </button>
        </div>
      </div>

      {/* Conditionally render Cards component */}
      {shouldShowCards && (
        <Cards
          toDoCount={toDoTasks.length}
          inProgressCount={inProgressTasks.length}
          underReviewCount={underReviewTasks.length}
          completedCount={completedTasks.length}
          delCount={delCount}
        />
      )}

      <Tasks />
    </div>
  );
}
