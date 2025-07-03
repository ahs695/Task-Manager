import React, { useState } from "react";
import styles from "./Tasks.module.css";
import TaskCard from "../TaskCard/TaskCard";
import ViewTask from "./ViewTaskModal/ViewTask";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../../Redux/Tasks/taskAPI";
import { fetchTaskAssignments } from "../../../Redux/TaskAssignments/taskAssignmentAPI";
import { jwtDecode } from "jwt-decode";

export default function Tasks() {
  const [viewingTask, setViewingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const dispatch = useDispatch();
  const allProjects = useSelector((state) => state.projects.allProjects);
  const allUsers = useSelector((state) => state.users.allUsers);
  const allTasks = useSelector((state) => state.tasks.allTasks);
  const token = useSelector((state) => state.auth.token);

  const getProjectNameById = (projectId) => {
    const project = allProjects.find((p) => p._id === projectId);
    return project ? project.projectName : "Unknown Project";
  };

  const getUserNameById = (userId) => {
    const user = allUsers.find((u) => u._id === userId);
    return user ? user.name : "Unassigned";
  };

  const handleAddComment = async (commentText) => {
    try {
      const updatedComments = [...viewingTask.comments, commentText];

      await axios.put(
        `http://localhost:5000/api/tasks/${viewingTask._id}`,
        {
          comments: updatedComments, // or [commentText] if backend handles it properly
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token here
          },
        }
      );

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

  const handleDragStart = (task) => {
    setDraggedTask({ task });
  };

  const handleDrop = async (targetCategory) => {
    if (!draggedTask) return;

    const { task } = draggedTask;

    if (task.category === targetCategory) {
      setDraggedTask(null);
      return;
    }

    try {
      // Decode JWT to get the current user's ID

      const decodedToken = jwtDecode(token);
      const currentUserId = decodedToken.id; // or `decodedToken.userId` depending on your JWT payload

      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          category: targetCategory,
          $push: {
            statusHistory: {
              status: targetCategory,
              user: currentUserId,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ include JWT token here
          },
        }
      );

      dispatch(fetchTaskAssignments());
      dispatch(fetchAllTasks());
    } catch (err) {
      console.error("Failed to update task category:", err);
      alert("Failed to move task. Try again.");
    }

    setDraggedTask(null);
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className={styles.tasks}>
      <div className={styles.searchBar}>
        <div>
          <h2>My Tasks</h2>
        </div>
        <button
          className={styles.createButton}
          onClick={() => {
            alert("You don't have permission to create tasks.");
          }}
        >
          <img src="/create.png" alt="create" />
          Create Task
        </button>
      </div>

      <div className={styles.taskHead}>
        <div className={styles.taskStatus}>To Do</div>
        <div className={styles.taskStatus}>In Progress</div>
        <div className={styles.taskStatus}>Under Review</div>
        <div className={styles.taskStatus}>Completed</div>
      </div>

      <div className={styles.taskCards}>
        {/* TO DO */}
        <div
          className={styles.toDoCards}
          onDragOver={allowDrop}
          onDrop={() => handleDrop("todo")}
        >
          {allTasks
            .filter((task) => task.category === "todo")
            .map((task) => (
              <div
                key={task._id}
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                <TaskCard
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  userName={getUserNameById(task.user)}
                  priority={task.priority}
                  dueDate={task.dueDate}
                  creationTime={task.creationTime}
                  onFullView={() => setViewingTask(task)}
                />
              </div>
            ))}
        </div>

        {/* IN PROGRESS */}
        <div
          className={styles.inProgressCards}
          onDragOver={allowDrop}
          onDrop={() => handleDrop("inprogress")}
        >
          {allTasks
            .filter((task) => task.category === "inprogress")
            .map((task) => (
              <div
                key={task._id}
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                <TaskCard
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  description={task.description}
                  userName={getUserNameById(task.user)}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  creationTime={task.creationTime}
                  onFullView={() => setViewingTask(task)}
                />
              </div>
            ))}
        </div>

        {/* UNDER REVIEW */}
        <div
          className={styles.underReviewCards}
          onDragOver={allowDrop}
          onDrop={() => handleDrop("underreview")}
        >
          {allTasks
            .filter((task) => task.category === "underreview")
            .map((task) => (
              <div
                key={task._id}
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                <TaskCard
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  description={task.description}
                  userName={getUserNameById(task.user)}
                  priority={task.priority}
                  dueDate={task.dueDate}
                  creationTime={task.creationTime}
                  onFullView={() => setViewingTask(task)}
                />
              </div>
            ))}
        </div>

        {/* COMPLETED */}
        <div
          className={styles.completedCards}
          onDragOver={allowDrop}
          onDrop={() => handleDrop("completed")}
        >
          {allTasks
            .filter((task) => task.category === "completed")
            .map((task) => (
              <div
                key={task._id}
                draggable
                onDragStart={() => handleDragStart(task)}
              >
                <TaskCard
                  project={getProjectNameById(task.project)}
                  title={task.title}
                  description={task.description}
                  userName={getUserNameById(task.user)}
                  priority={task.priority}
                  dueDate={task.dueDate}
                  completedAt={task.completionTime}
                  creationTime={task.creationTime}
                  isCompleted={true}
                  onEdit={() => {
                    alert("Completed Tasks can not be Edited");
                  }}
                  onDelete={() => {
                    alert("Completed Tasks can not be Deleted");
                  }}
                  onFullView={() => setViewingTask(task)}
                />
              </div>
            ))}
        </div>
      </div>

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
