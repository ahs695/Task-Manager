import React, { useState } from "react";
import styles from "./ViewTask.module.css";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export default function ViewTask({ task, onCloseTab, onAddComment }) {
  const allProjects = useSelector((state) => state.projects.allProjects);
  const allUsers = useSelector((state) => state.users.allUsers);
  const token = useSelector((state) => state.auth.token);

  const [newComment, setNewComment] = useState("");
  const [closing, setClosing] = useState(false);

  const currentUserId = token ? jwtDecode(token)?.id : null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentObject = {
        text: newComment.trim(),
        time: new Date(),
        user: currentUserId,
      };
      onAddComment(commentObject);
      setNewComment("");
    }
  };

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(() => {
      onCloseTab();
    }, 600);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const projectObj = allProjects.find((proj) => proj._id === task.project);
  const projectName = projectObj ? projectObj.projectName : "N/A";
  const userObj = allUsers.find((u) => u._id === task.user);
  const userName = userObj ? userObj.name : "Unassigned";

  return (
    <div className={styles.viewTaskOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.viewTask} ${
          closing ? styles.slideOut : styles.slideIn
        }`}
        onClick={stopPropagation}
      >
        <h2 className={styles.taskTitle}>{task.title}</h2>
        <div className={styles.taskData}>
          <p>
            <strong>{projectName}</strong> ({userName}) <br />
            {new Date(task.creationTime).toLocaleString()}
          </p>

          <p>{task.description}</p>

          <p className={styles.deadline}>
            <strong>Deadline:</strong> {new Date(task.dueDate).toLocaleString()}{" "}
            {task.priority === "High" && (
              <img src="/cautionhigh.png" alt="High" />
            )}
            {task.priority === "Mid" && <img src="/cautionmid.png" alt="Mid" />}
            {task.priority === "Low" && (
              <img src="/cautionlow.png" alt="Low" />
            )}{" "}
            ({task.category})
          </p>

          <hr />
          <h3>Comments</h3>
          <div className={styles.commentsSection}>
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment, index) => {
                const commentUser = allUsers.find(
                  (u) => u._id === comment.user
                );
                const commenterName = commentUser
                  ? commentUser.name
                  : "Unknown User";
                return (
                  <div key={index} className={styles.comment}>
                    <p>
                      <strong>{commenterName}</strong> &middot;{" "}
                      <em>{new Date(comment.time).toLocaleString()}</em>
                    </p>
                    <p>{comment.text}</p>
                  </div>
                );
              })
            ) : (
              <p>No comments yet.</p>
            )}

            <div className={styles.commentInput}>
              <textarea
                rows={2}
                value={newComment}
                placeholder="Add a comment..."
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>

            {/* ✅ Status History Display */}
            <hr />
            <h3>Status History</h3>
            {task.statusHistory && task.statusHistory.length > 0 ? (
              <ul className={styles.statusHistory}>
                {task.statusHistory.map((entry, index) => {
                  const user = allUsers.find((u) => u._id === entry.user);
                  const userName = user ? user.name : "Unknown User";
                  const timestamp = new Date(entry.timestamp).toLocaleString();

                  return (
                    <li key={index}>
                      {index === 0 ? (
                        <>
                          Created by <strong>{userName}</strong> at {timestamp}
                        </>
                      ) : (
                        <>
                          Moved to <strong>{entry.status}</strong> by{" "}
                          <strong>{userName}</strong> at {timestamp}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No status changes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
