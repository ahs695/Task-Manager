import React, { useState, useEffect } from "react";
import styles from "./Projects.module.css";
import CreateProject from "./CreateProject/CreateProject";
import ProjectFilter from "./ProjectFilter/ProjectFilter";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProjects } from "../../Redux/Projects/projectAPI";
import { hasPermission } from "../../App/Utility/permission";

export default function Projects() {
  const permissions = useSelector((state) => state.auth.permissions);
  const dispatch = useDispatch();
  const allProjects = useSelector((state) => state.projects.allProjects);
  const taskAssignments = useSelector(
    (state) => state.taskAssignments.assignments
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  useEffect(() => {
    setFilteredProjects(allProjects);
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
      dispatch(fetchAllProjects()); // refresh project list
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
    setEditProject(null);
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
              if (!hasPermission(permissions, "Project", "create")) {
                alert("You do not have permission to create a project.");
                return;
              }
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
                  onClick={() => {
                    if (!hasPermission(permissions, "Project", "edit")) {
                      alert("You do not have permission to edit a project.");
                      return;
                    }
                    openEditModal(project);
                  }}
                  title="Edit"
                  src="/edit.png"
                  alt=""
                />

                <img
                  onClick={() => {
                    if (!hasPermission(permissions, "Project", "delete")) {
                      alert("You do not have permission to delete a project.");
                      return;
                    }
                    handleDelete(project._id);
                  }}
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
          existingProject={editProject}
        />
      )}
      {showFilterModal && (
        <ProjectFilter
          setFilteredProjects={setFilteredProjects}
          onCloseTab={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}
