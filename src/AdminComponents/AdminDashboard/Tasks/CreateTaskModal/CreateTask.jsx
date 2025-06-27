import React, { useState } from "react";
import styles from "./CreateTask.module.css";

export default function CreateTaskModal({
  operation,
  newTask,
  onChange,
  onClose,
  onSubmit,
  onCloseTab,
  operationButton,
  allUsers,
  allProjects,
  allTasks,
}) {
  const [showCustomLabel, setShowCustomLabel] = useState(false);

  const handleOverlayClick = () => {
    onCloseTab(); // Close when clicking on overlay
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent click from reaching overlay
  };

  const handleLabelSelect = (e) => {
    const value = e.target.value;
    if (value === "Custom") {
      setShowCustomLabel(true);
      onChange({ target: { name: "label", value: "" } });
    } else {
      setShowCustomLabel(false);
      onChange({ target: { name: "label", value } });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={stopPropagation}>
        <h2>{operation}</h2>

        <div className={styles.modalInput}>
          <div className={styles.inputFeild}>
            <label></label>
            Assign To:
            <select name="user" value={newTask.user} onChange={onChange}>
              <option value="">Unassigned</option>
              {allUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputFeild}>
            <label>Project:</label>
            <select
              name="project"
              value={newTask.project}
              onChange={onChange}
              required
            >
              <option value="">Select Project</option>
              {allProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputFeild}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={onChange}
            />
          </div>

          <div className={styles.inputFeild}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              value={newTask.description}
              onChange={onChange}
            ></textarea>
          </div>
          <div className={styles.inputFeild}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority}
              onChange={onChange}
            >
              <option value="">Select priority</option>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className={styles.inputFeild}>
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={newTask.dueDate ? newTask.dueDate.substring(0, 10) : ""}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.addTaskButton} onClick={onSubmit}>
            {operationButton}
          </button>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}
