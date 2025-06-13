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
            <label htmlFor="label">Label</label>
            <select
              id="label"
              name="label"
              onChange={handleLabelSelect}
              value={
                ["Work", "Personal", "Home"].includes(newTask.label)
                  ? newTask.label
                  : "Custom"
              }
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Home">Home</option>
              <option value="Custom">Custom</option>
            </select>

            {showCustomLabel && (
              <>
                <label htmlFor="customLabel">Custom Label</label>
                <input
                  id="customLabel"
                  type="text"
                  name="label"
                  placeholder="Enter custom label"
                  value={newTask.label}
                  onChange={onChange}
                />
              </>
            )}
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
