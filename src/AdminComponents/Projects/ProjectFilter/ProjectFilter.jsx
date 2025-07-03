import React, { useState, useEffect } from "react";
import styles from "./ProjectFilter.module.css";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";

export default function ProjectFilter({ setFilteredProjects, onCloseTab }) {
  const allUsers = useSelector((state) => state.users.allUsers);
  const taskAssignments = useSelector(
    (state) => state.taskAssignments.assignments
  );
  const [showUser, setShowUser] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const allProjects = useSelector((state) => state.projects.allProjects);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const allUserOptions = allUsers.map((user) => ({
    id: user._id,
    name: user.name,
  }));

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

    // Filter by user (if selected)
    if (selectedUsers.length > 0) {
      const projectIdsWithUsers = taskAssignments
        .filter((a) => selectedUsers.includes(a.userId?._id || a.userId))
        .map((a) => a.projectId._id || a.projectId);

      filtered = filtered.filter((p) => projectIdsWithUsers.includes(p._id));
    }

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
  }, [
    selectedUsers,
    selectedStatuses,
    allProjects,
    taskAssignments,
    setFilteredProjects,
  ]);

  return (
    <div className={styles.projectFilterOverlay} onClick={handleOverlayClick}>
      <div className={styles.projectFilterModal} onClick={stopPropagation}>
        <h3>Filter Projects</h3>

        {/* Filter by user */}
        <div className={styles.filterSection}>
          <label className={styles.filterTitle}>
            <input
              type="checkbox"
              checked={showUser}
              onChange={() => setShowUser(!showUser)}
            />
            User
          </label>
          {showUser && (
            <Select
              isMulti
              options={allUserOptions.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              value={selectedUsers.map((id) => {
                const user = allUserOptions.find((u) => u.id === id);
                return { value: id, label: user?.name || id };
              })}
              onChange={(selectedOptions) =>
                setSelectedUsers(selectedOptions.map((opt) => opt.value))
              }
              className={styles.multiSelectDropdown}
            />
          )}
        </div>

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
