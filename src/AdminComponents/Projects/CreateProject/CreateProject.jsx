import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateProject.module.css";

export default function CreateProject({
  onCloseTab,
  fetchProjects,
  existingProject,
}) {
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingProject) {
      setProjectName(existingProject.projectName);
    }
  }, [existingProject]);

  const handleChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert("Project name cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      if (existingProject) {
        await axios.put(
          `http://localhost:5000/api/projects/${existingProject._id}`,
          {
            projectName,
          }
        );
        alert("Project updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/projects", {
          projectName,
        });
        alert("Project created successfully!");
      }

      fetchProjects();
      onCloseTab();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!existingProject) return;

    try {
      await axios.put(
        `http://localhost:5000/api/projects/${existingProject._id}/complete`
      );
      alert("Project marked as complete.");
      fetchProjects();
      onCloseTab();
    } catch (err) {
      console.error(err);
      alert("Failed to mark project as complete");
    }
  };

  const [closing, setClosing] = useState(false);

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(() => {
      onCloseTab(); // Only call after animation ends
    }, 600); // matches animation duration
  };
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className={styles.createProjectOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.createProject} ${
          closing ? styles.slideOut : styles.slideIn
        }`}
        onClick={stopPropagation}
      >
        <h2>{existingProject ? "Edit Project" : "Create New Project"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Project Name:
            <input
              type="text"
              value={projectName}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {existingProject ? "Update Project Name" : "Create Project"}
          </button>

          {existingProject && !existingProject.completionTime && (
            <button type="button" onClick={handleMarkComplete}>
              Mark as Complete
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
