import React, { useState, useEffect } from "react";
import styles from "./MyTasks.module.css";
import TaskCard from "../Dashboard/TaskCard/TaskCard";
import Filter from "./Filter/Filter";
import { useSelector, useDispatch } from "react-redux";
import ViewTask from "../Dashboard/Tasks/ViewTaskModal/ViewTask";
import { fetchAllTasks } from "../../Redux/Tasks/taskAPI";
import { fetchTaskAssignments } from "../../Redux/TaskAssignments/taskAssignmentAPI";
import axios from "axios";

export default function MyTasks() {
  const dispatch = useDispatch();
  const [viewingTask, setViewingTask] = useState(null);
  const { allTasks } = useSelector((state) => state.tasks);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(allTasks);
  const allProjects = useSelector((state) => state.projects.allProjects);
  const allUsers = useSelector((state) => state.users.allUsers);

  const handleAddComment = async (commentText) => {
    try {
      const updatedComments = [...viewingTask.comments, commentText];
      await axios.put(`http://localhost:5000/api/tasks/${viewingTask._id}`, {
        comments: updatedComments,
      });

      setViewingTask((prev) => ({
        ...prev,
        comments: updatedComments,
      }));

      dispatch(fetchTaskAssignments());
      dispatch(fetchAllTasks());
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    }
  };

  // Apply both filter and search to tasks
  useEffect(() => {
    let result = [...allTasks];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [allTasks, searchQuery]);

  const getProjectNameById = (projectId) => {
    const project = allProjects.find((p) => p._id === projectId);
    return project ? project.projectName : "Unknown Project";
  };

  const getUserNameById = (userId) => {
    const user = allUsers.find((u) => u._id === userId);
    return user ? user.name : "Unassigned";
  };

  // Handle filter changes from Filter component
  const handleFilterChange = (filtered) => {
    let result = [...filtered];

    // Apply search to the filtered results
    if (searchQuery) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  };

  return (
    <div className={styles.myTasks}>
      <div className={styles.myTasksTop}>
        <h1>My Tasks</h1>
        <div className={styles.taskOptions}>
          <div className={styles.taskOption}>
            <img src="/searchab.png" alt="" />
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={styles.taskOption}
            onClick={() => setShowFilter(!showFilter)}
          >
            <img src="/filterab.png" alt="" />
            Filter
          </button>
        </div>
      </div>

      <div className={styles.myTasksData}>
        <div className={styles.taskHead}>
          <div className={styles.taskStatus}>To Do</div>
          <div className={styles.taskStatus}>In Progress</div>
          <div className={styles.taskStatus}>Under Review</div>
          <div className={styles.taskStatus}>Completed</div>
        </div>
        <div className={styles.taskCards}>
          {/* TO DO */}
          <div className={styles.toDoCards}>
            {filteredTasks
              .filter((task) => task.category === "todo")
              .map((task) => (
                <TaskCard
                  key={task._id}
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  userName={getUserNameById(task.user)}
                  priority={task.priority}
                  dueDate={task.dueDate}
                  creationTime={task.creationTime}
                  onFullView={() => setViewingTask(task)}
                />
              ))}
          </div>

          {/* IN PROGRESS */}
          <div className={styles.inProgressCards}>
            {filteredTasks
              .filter((task) => task.category === "inprogress")
              .map((task) => (
                <TaskCard
                  key={task._id}
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  description={task.description}
                  userName={getUserNameById(task.user)}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  creationTime={task.creationTime}
                />
              ))}
          </div>

          {/* UNDER REVIEW */}
          <div className={styles.underReviewCards}>
            {filteredTasks
              .filter((task) => task.category === "underreview")
              .map((task) => (
                <TaskCard
                  key={task._id}
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  description={task.description}
                  userName={getUserNameById(task.user)}
                  priority={task.priority}
                  creationTime={task.creationTime}
                  dueDate={task.dueDate}
                />
              ))}
          </div>

          {/* COMPLETED */}
          <div className={styles.completedCards}>
            {filteredTasks
              .filter((task) => task.category === "completed")
              .map((task) => (
                <TaskCard
                  key={task._id}
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  creationTime={task.creationTime}
                  description={task.description}
                  userName={getUserNameById(task.user)}
                  priority={task.priority}
                  dueDate={task.dueDate}
                  completedAt={task.completionTime}
                  isCompleted={true}
                />
              ))}
          </div>
        </div>
      </div>

      {showFilter && (
        <Filter
          setFilteredTasks={handleFilterChange}
          onCloseTab={() => setShowFilter(false)}
        />
      )}
      {viewingTask && (
        <ViewTask
          task={viewingTask}
          onCloseTab={() => setViewingTask(null)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
