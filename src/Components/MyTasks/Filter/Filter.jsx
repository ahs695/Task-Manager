import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";

export default function Filter({ setFilteredTasks, onCloseTab }) {
  const allTasks = useSelector((state) => state.tasks.allTasks);
  const taskAssignments = useSelector(
    (state) => state.taskAssignments.assignments
  );

  const [showPriority, setShowPriority] = useState(false);
  const [showProject, setShowProject] = useState(false);

  const allProjects = useSelector((state) => state.projects.allProjects);

  // Selected values

  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const allPriorities = [...new Set(allTasks.map((task) => task.priority))];
  const allProjectOptions = allProjects.map((proj) => ({
    id: proj._id,
    name: proj.projectName,
  }));

  const handleOverlayClick = () => {
    onCloseTab();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...allTasks];

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

    setFilteredTasks(filtered);
  }, [
    selectedPriorities,
    selectedProjects,
    allTasks,
    taskAssignments,
    setFilteredTasks,
  ]);

  return (
    <div className={styles.filterOverlay} onClick={handleOverlayClick}>
      <div className={styles.filterModal} onClick={stopPropagation}>
        <div className={styles.filterHeader}>
          <h3>Filter Tasks</h3>
        </div>

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
            <div className={styles.filterOptions}>
              {allPriorities.map((priority) => (
                <label key={priority} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={selectedPriorities.includes(priority)}
                    onChange={() =>
                      toggleSelected(
                        priority,
                        setSelectedPriorities,
                        selectedPriorities
                      )
                    }
                  />
                  {priority}
                </label>
              ))}
            </div>
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
      </div>
    </div>
  );
}

function toggleSelected(value, setter, current) {
  setter(
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  );
}
