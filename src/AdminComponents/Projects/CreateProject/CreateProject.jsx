import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateProject.module.css";
import { useDispatch } from "react-redux";
import { fetchAllProjects } from "../../../Redux/Projects/projectAPI";
import { useSelector } from "react-redux";
export default function CreateProject({
  onCloseTab,

  existingProject,
}) {
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const allOrganizations = useSelector(
    (state) => state.organizations.allOrganizations
  );
  {
    console.log(allOrganizations);
  }
  const { role, organization } = useSelector((state) => state.auth);
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
          organization: organization?.id || selectedOrg, // attach logged-in org or selected org
        });

        alert("Project created successfully!");
      }

      dispatch(fetchAllProjects());
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
      dispatch(fetchAllProjects());
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

          {!organization && (
            <label>
              Select Organization:
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                required
              >
                <option value="">-- Select --</option>
                {allOrganizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </label>
          )}

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
