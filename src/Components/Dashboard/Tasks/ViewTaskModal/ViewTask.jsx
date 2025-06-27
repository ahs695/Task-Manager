import React, { useState } from "react";
import styles from "./ViewTask.module.css";

export default function ViewTask({ task, onCloseTab, onAddComment }) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleOverlayClick = () => {
    onCloseTab(); // Close when clicking on overlay
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent click from reaching overlay
  };

  return (
    <div className={styles.viewTaskOverlay} onClick={handleOverlayClick}>
      <div className={styles.viewTask} onClick={stopPropagation}>
        <h2 className={styles.taskTitle}>{task.title}</h2>
        <div className={styles.taskData}>
          <p>
            <strong>Label:</strong> {task.label}
          </p>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Category:</strong> {task.category}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(task.creationTime).toLocaleString()}
          </p>
          {task.startedTime && (
            <p>
              <strong>Started:</strong>{" "}
              {new Date(task.startedTime).toLocaleString()}
            </p>
          )}
          {task.reviewTime && (
            <p>
              <strong>In Review:</strong>{" "}
              {new Date(task.reviewTime).toLocaleString()}
            </p>
          )}
          {task.completionTime && (
            <p>
              <strong>Completed:</strong>{" "}
              {new Date(task.completionTime).toLocaleString()}
            </p>
          )}

          <hr />

          <h3>Comments</h3>
          <div className={styles.commentsSection}>
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  {comment}
                </div>
              ))
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
