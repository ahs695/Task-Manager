import React, { useState, useEffect } from "react";
import styles from "./Projects.module.css";
import CreateProject from "./CreateProject/CreateProject";
import ProjectFilter from "./ProjectFilter/ProjectFilter";
import axios from "axios";

export default function Projects({
  allProjects,
  fetchProjects,
  allUsers,
  allTasks,
  taskAssignments,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProject, setEditProject] = useState(null); // holds project to edit
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  useEffect(() => {
    setFilteredProjects(allProjects); // keep it fresh if props change
  }, [allProjects]);

  const handleDelete = async (projectId) => {
    const hasTasks = taskAssignments.some(
      (assignment) =>
        assignment.projectId === projectId ||
        assignment.projectId?._id === projectId
    );

    if (hasTasks) {
      alert("Cannot delete this project because tasks are assigned to it.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      alert("Project deleted successfully.");
      fetchProjects(); // refresh project list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const openEditModal = (project) => {
    setEditProject(project);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditProject(null); // reset after closing
  };

  return (
    <div className={styles.projects}>
      <div className={styles.projectsTop}>
        <h2>All Projects</h2>
        <div className={styles.projectsOptions}>
          <button
            className={styles.projectOption}
            onClick={() => setShowFilterModal(true)}
          >
            <img src="/filterab.png" alt="" />
            Filter
          </button>

          <button
            className={styles.projectOption}
            onClick={() => {
              setEditProject(null);
              setShowCreateModal(true);
            }}
          >
            <img src="/add-userab.png" alt="Create" />
            Create
          </button>
        </div>
      </div>

      <table className={styles.projectTable}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Created</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project._id}>
              <td>{project.projectName}</td>
              <td>{new Date(project.creationTime).toLocaleDateString()}</td>
              <td>
                {project.completionTime
                  ? new Date(project.completionTime).toLocaleDateString()
                  : "In Progress"}
              </td>
              <td>
                <img
                  className={styles.edImg}
                  onClick={() => openEditModal(project)}
                  title="Edit"
                  src="/edit.png"
                  alt=""
                />

                <img
                  onClick={() => handleDelete(project._id)}
                  src="/delete.png"
                  alt=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <CreateProject
          onCloseTab={handleCloseModal}
          fetchProjects={fetchProjects}
          existingProject={editProject}
        />
      )}
      {showFilterModal && (
        <ProjectFilter
          allProjects={allProjects}
          taskAssignments={taskAssignments}
          allUsers={allUsers}
          setFilteredProjects={setFilteredProjects}
          onCloseTab={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}
