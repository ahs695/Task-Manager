import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import Select from "react-select";

export default function Filter({
  allTasks,
  setFilteredTasks,
  onCloseTab,
  taskAssignments,
  allProjects,
  allUsers,
}) {
  // Toggle filter group visibility
  const [showCategory, setShowCategory] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showUser, setShowUser] = useState(false);

  // Selected values
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const allCategories = [...new Set(allTasks.map((task) => task.category))];
  const allPriorities = [...new Set(allTasks.map((task) => task.priority))];
  const allProjectOptions = allProjects.map((proj) => ({
    id: proj._id,
    name: proj.projectName,
  }));
  const allUserOptions = allUsers.map((user) => ({
    id: user._id,
    name: user.name,
  }));

  const handleOverlayClick = () => {
    onCloseTab(); // Close when clicking on overlay
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent click from reaching overlay
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...allTasks];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((task) =>
        selectedCategories.includes(task.category)
      );
    }

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((task) =>
        selectedPriorities.includes(task.priority)
      );
    }

    if (selectedProjects.length > 0) {
      const projectTaskIds = taskAssignments
        .filter((a) =>
          selectedProjects.includes(a.projectId?._id || a.projectId)
        )
        .map((a) => a.taskId._id || a.taskId);
      filtered = filtered.filter((task) => projectTaskIds.includes(task._id));
    }

    if (selectedUsers.length > 0) {
      const userTaskIds = taskAssignments
        .filter((a) => selectedUsers.includes(a.userId?._id || a.userId))
        .map((a) => a.taskId._id || a.taskId);
      filtered = filtered.filter((task) => userTaskIds.includes(task._id));
    }

    setFilteredTasks(filtered);
  }, [
    selectedCategories,
    selectedPriorities,
    selectedProjects,
    selectedUsers,
    allTasks,
    taskAssignments,
    setFilteredTasks,
  ]);

  // Handlers
  const toggleSelected = (value, listSetter, list) => {
    listSetter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  return (
    <div className={styles.filterOverlay} onClick={handleOverlayClick}>
      <div className={styles.filterModal} onClick={stopPropagation}>
        <h3>Filter Tasks</h3>
        <div className={styles.filterSection}>
          <label className={styles.categ}>
            <input
              type="checkbox"
              checked={showPriority}
              onChange={() => setShowPriority(!showPriority)}
            />
            Priority
          </label>
          {showPriority && (
            <Select
              isMulti
              options={allPriorities.map((priority) => ({
                value: priority,
                label: priority,
              }))}
              value={selectedPriorities.map((priority) => ({
                value: priority,
                label: priority,
              }))}
              onChange={(selectedOptions) =>
                setSelectedPriorities(selectedOptions.map((opt) => opt.value))
              }
              className={styles.multiSelectDropdown}
            />
          )}
        </div>
        <div className={styles.filterSection}>
          <label className={styles.categ}>
            <input
              type="checkbox"
              checked={showProject}
              onChange={() => setShowProject(!showProject)}
            />
            Project
          </label>
          {showProject && (
            <Select
              isMulti
              options={allProjectOptions.map((proj) => ({
                value: proj.id,
                label: proj.name,
              }))}
              value={selectedProjects.map((id) => {
                const proj = allProjectOptions.find((p) => p.id === id);
                return { value: id, label: proj?.name || id };
              })}
              onChange={(selectedOptions) =>
                setSelectedProjects(selectedOptions.map((opt) => opt.value))
              }
              className={styles.multiSelectDropdown}
            />
          )}
        </div>
        <div className={styles.filterSection}>
          <label className={styles.categ}>
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
      </div>
    </div>
  );
}
