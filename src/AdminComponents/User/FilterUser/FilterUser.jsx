import React, { useState, useEffect } from "react";
import styles from "./FilterUser.module.css";
import Select from "react-select";
import { useSelector } from "react-redux";
export default function FilterUser({ setFilteredUsers, onCloseTab }) {
  const allUsers = useSelector((state) => state.users.allUsers);
  const allProjects = useSelector((state) => state.projects.allProjects);
  const taskAssignments = useSelector(
    (state) => state.taskAssignments.assignments
  );
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showProjectFilter, setShowProjectFilter] = useState(false);

  const allRoles = [
    ...new Set(allUsers.map((user) => user.role?.rolename)),
  ].filter(Boolean);

  const allProjectOptions = allProjects.map((proj) => ({
    value: proj._id,
    label: proj.projectName,
  }));

  const handleOverlayClick = () => {
    onCloseTab();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const toggleSelected = (value, setter, list) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  useEffect(() => {
    let filtered = [...allUsers];

    // Role filter
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((user) =>
        selectedRoles.includes(user.role?.rolename)
      );
    }

    // Project filter
    if (selectedProjects.length > 0) {
      const userIdsInProjects = taskAssignments
        .filter((a) =>
          selectedProjects.includes(a.projectId?._id || a.projectId)
        )
        .map((a) => a.userId?._id || a.userId);

      filtered = filtered.filter((user) =>
        userIdsInProjects.includes(user._id)
      );
    }

    setFilteredUsers(filtered);
  }, [
    selectedRoles,
    selectedProjects,
    allUsers,
    taskAssignments,
    setFilteredUsers,
  ]);

  return (
    <div className={styles.filterUserOverlay} onClick={handleOverlayClick}>
      <div className={styles.filterUserModal} onClick={stopPropagation}>
        <h3 className={styles.title}>Filter Users</h3>

        {/* Role Filter */}
        <div className={styles.filterSection}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showRoleFilter}
              onChange={() => setShowRoleFilter(!showRoleFilter)}
            />
            Role
          </label>

          {showRoleFilter && (
            <Select
              isMulti
              options={allRoles.map((role) => ({ value: role, label: role }))}
              value={selectedRoles.map((role) => ({
                value: role,
                label: role,
              }))}
              onChange={(selected) =>
                setSelectedRoles(selected.map((item) => item.value))
              }
              className={styles.multiSelect}
            />
          )}
        </div>

        {/* Project Filter */}
        <div className={styles.filterSection}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showProjectFilter}
              onChange={() => setShowProjectFilter(!showProjectFilter)}
            />
            Project
          </label>

          {showProjectFilter && (
            <Select
              isMulti
              options={allProjectOptions}
              value={selectedProjects.map((id) => {
                const match = allProjectOptions.find((p) => p.value === id);
                return { value: id, label: match?.label || id };
              })}
              onChange={(selected) =>
                setSelectedProjects(selected.map((item) => item.value))
              }
              className={styles.multiSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
