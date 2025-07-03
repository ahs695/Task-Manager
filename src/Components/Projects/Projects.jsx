import React, { useState, useEffect } from "react";
import styles from "./Projects.module.css";
import ProjectFilter from "./ProjectFilter/ProjectFilter";
import { useSelector } from "react-redux";

export default function Projects() {
  const allProjects = useSelector((state) => state.projects.allProjects);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  useEffect(() => {
    setFilteredProjects(allProjects);
  }, [allProjects]);

  return (
    <div className={styles.projects}>
      <div className={styles.projectsTop}>
        <h2>My Projects</h2>
        <div className={styles.projectsOptions}>
          <button
            className={styles.projectOption}
            onClick={() => setShowFilterModal(true)}
          >
            <img src="/filterab.png" alt="" />
            Filter
          </button>
        </div>
      </div>

      <table className={styles.projectTable}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Created</th>
            <th>Completed</th>
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
            </tr>
          ))}
        </tbody>
      </table>

      {showFilterModal && (
        <ProjectFilter
          setFilteredProjects={setFilteredProjects}
          onCloseTab={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}
