import React, { useState, useEffect } from "react";
import styles from "./Filter.module.css";

export default function Filter({ allTasks, setFilteredTasks, onCloseTab }) {
  // Toggle filter group visibility
  const [showCategory, setShowCategory] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  // Selected values
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);

  const allCategories = [...new Set(allTasks.map((task) => task.category))];
  const allLabels = [...new Set(allTasks.map((task) => task.label))];
  const allPriorities = [...new Set(allTasks.map((task) => task.priority))];

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

    if (selectedLabels.length > 0) {
      filtered = filtered.filter((task) => selectedLabels.includes(task.label));
    }

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((task) =>
        selectedPriorities.includes(task.priority)
      );
    }

    setFilteredTasks(filtered);
  }, [
    selectedCategories,
    selectedLabels,
    selectedPriorities,
    allTasks,
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

        {/* Category */}
        <div className={styles.filterSection}>
          <label className={styles.categ}>
            <input
              type="checkbox"
              checked={showCategory}
              onChange={() => setShowCategory(!showCategory)}
            />
            Category
          </label>
          {showCategory &&
            allCategories.map((cat) => (
              <div key={cat} className={styles.subOption}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() =>
                    toggleSelected(
                      cat,
                      setSelectedCategories,
                      selectedCategories
                    )
                  }
                />
                <label>{cat}</label>
              </div>
            ))}
        </div>

        {/* Label */}
        <div className={styles.filterSection}>
          <label className={styles.categ}>
            <input
              type="checkbox"
              checked={showLabel}
              onChange={() => setShowLabel(!showLabel)}
            />
            Label
          </label>
          {showLabel &&
            allLabels.map((label) => (
              <div key={label} className={styles.subOption}>
                <input
                  type="checkbox"
                  checked={selectedLabels.includes(label)}
                  onChange={() =>
                    toggleSelected(label, setSelectedLabels, selectedLabels)
                  }
                />
                <label>{label}</label>
              </div>
            ))}
        </div>

        {/* Priority */}
        <div className={styles.filterSection}>
          <label className={styles.categ}>
            <input
              type="checkbox"
              checked={showPriority}
              onChange={() => setShowPriority(!showPriority)}
            />
            Priority
          </label>
          {showPriority &&
            allPriorities.map((priority) => (
              <div key={priority} className={styles.subOption}>
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
                <label>{priority}</label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
