import React, { useState } from "react";
import styles from "./ViewTask.module.css";
import { useAuth } from "../../../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function ViewTask({
  task,
  onCloseTab,
  onAddComment,
  allProjects,
  allUsers,
}) {
  const [newComment, setNewComment] = useState("");

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

  const [closing, setClosing] = useState(false);

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(() => {
      onCloseTab(); // Only call after animation ends
    }, 600); // matches animation duration
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent click from reaching overlay
  };

  const projectObj = allProjects.find((proj) => proj._id === task.project);
  const projectName = projectObj ? projectObj.projectName : "N/A";
  const userObj = allUsers.find((u) => u._id === task.user);
  const userName = userObj ? userObj.name : "Unassigned";

  const { auth } = useAuth();
  const decoded = jwtDecode(auth.token);
  const currentUserId = decoded.id;

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
            <strong> {projectName}</strong> ({userName}) <br />
            {new Date(task.creationTime).toLocaleString()}
          </p>

          <p>{task.description}</p>

          <p className={styles.deadline}>
            <strong>Deadline:</strong> {new Date(task.dueDate).toLocaleString()}{" "}
            {task.priority === "High" && (
              <img
                src="/cautionhigh.png"
                alt="High Priority"
                style={{ width: "20px", height: "20px", marginLeft: "8px" }}
              />
            )}
            {task.priority === "Mid" && (
              <img
                src="/cautionmid.png"
                alt="Mid Priority"
                style={{ width: "20px", height: "20px", marginLeft: "8px" }}
              />
            )}
            {task.priority === "Low" && (
              <img
                src="/cautionlow.png"
                alt="Low Priority"
                style={{ width: "20px", height: "20px", marginLeft: "8px" }}
              />
            )}{" "}
            ({task.category})
          </p>
          {task.startedTime && (
            <p>
              <strong>Started:</strong>{" "}
              {new Date(task.startedTime).toLocaleString()}
            </p>
          )}
          {task.reviewTime && (
            <p>
              <strong>Forwarded for Review:</strong>{" "}
              {new Date(task.reviewTime).toLocaleString()}
            </p>
          )}
          {task.completionTime && (
            <p>
              <strong>Completed at:</strong>{" "}
              {new Date(task.completionTime).toLocaleString()}
            </p>
          )}

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
          </div>

          <div className={styles.commentInput}>
            <textarea
              rows={2}
              value={newComment}
              placeholder="Add a comment..."
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
