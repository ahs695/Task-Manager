import React, { useState, useEffect } from "react";
import styles from "./ProjectFilter.module.css";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";

export default function ProjectFilter({ setFilteredProjects, onCloseTab }) {
  const allUsers = useSelector((state) => state.users.allUsers);
  const taskAssignments = useSelector(
    (state) => state.taskAssignments.assignments
  );

  const [showStatus, setShowStatus] = useState(false);
  const allProjects = useSelector((state) => state.projects.allProjects);

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const toggleSelected = (value, setter, currentList) => {
    setter(
      currentList.includes(value)
        ? currentList.filter((v) => v !== value)
        : [...currentList, value]
    );
  };

  const handleOverlayClick = () => onCloseTab();
  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {
    let filtered = [...allProjects];

    // Filter by completion status (if selected)
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((project) => {
        const isCompleted = !!project.completionTime;
        return selectedStatuses.includes(
          isCompleted ? "completed" : "in-progress"
        );
      });
    }

    setFilteredProjects(filtered);
  }, [selectedStatuses, allProjects, taskAssignments, setFilteredProjects]);

  return (
    <div className={styles.projectFilterOverlay} onClick={handleOverlayClick}>
      <div className={styles.projectFilterModal} onClick={stopPropagation}>
        <h3>Filter Projects</h3>

        {/* Filter by completion status */}
        <div className={styles.filterSection}>
          <label className={styles.filterTitle}>
            <input
              type="checkbox"
              checked={showStatus}
              onChange={() => setShowStatus(!showStatus)}
            />
            Completion Status
          </label>
          {showStatus && (
            <>
              <div className={styles.subOption}>
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("completed")}
                  onChange={() =>
                    toggleSelected(
                      "completed",
                      setSelectedStatuses,
                      selectedStatuses
                    )
                  }
                />
                <label>Completed</label>
              </div>
              <div className={styles.subOption}>
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("in-progress")}
                  onChange={() =>
                    toggleSelected(
                      "in-progress",
                      setSelectedStatuses,
                      selectedStatuses
                    )
                  }
                />
                <label>In Progress</label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
