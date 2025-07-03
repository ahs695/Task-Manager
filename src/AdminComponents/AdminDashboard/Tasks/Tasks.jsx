import React, { useState } from "react";
import styles from "./Tasks.module.css";
import TaskCard from "../TaskCard/TaskCard";
import CreateTaskModal from "./CreateTaskModal/CreateTask";
import ViewTask from "./ViewTaskModal/ViewTask";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../../Redux/Tasks/taskAPI";
import { fetchTaskAssignments } from "../../../Redux/TaskAssignments/taskAssignmentAPI";
import { hasPermission } from "../../../App/Utility/permission";
import { jwtDecode } from "jwt-decode";
export default function Tasks() {
  const permissions = useSelector((state) => state.auth.permissions);
  const dispatch = useDispatch();
  const allProjects = useSelector((state) => state.projects.allProjects);
  const [showModal, setShowModal] = useState(false);
  const allUsers = useSelector((state) => state.users.allUsers);
  const allTasks = useSelector((state) => state.tasks.allTasks);
  const token = useSelector((state) => state.auth.token);
  const [newTask, setNewTask] = useState({
    project: "",
    title: "",
    description: "",
    priority: "Low",
    category: "todo",
    user: "",
    dueDate: "",
  });

  //For edit:
  const [editMode, setEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState({
    task: null,
    sourceSetter: null,
  });

  const [draggedTask, setDraggedTask] = useState(null);

  const [viewingTask, setViewingTask] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTask = async () => {
    try {
      const currentUserId = token ? jwtDecode(token)?.id : null;

      if (!token || !currentUserId) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const { _id, creationTime, comments, statusHistory, ...taskData } =
        newTask;

      // Ensure required fields are filled
      if (!taskData.project || !taskData.title || !taskData.category) {
        alert(
          "Please fill in all required fields: project, title, and category."
        );
        return;
      }

      // Convert empty user string to null
      if (!taskData.user) {
        taskData.user = null;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editMode && _id) {
        // Update task
        await axios.put(
          `http://localhost:5000/api/tasks/${_id}`,
          taskData,
          config
        );
      } else {
        // Create new task
        await axios.post(`http://localhost:5000/api/tasks`, taskData, config);
      }

      // Refresh tasks and assignments
      dispatch(fetchTaskAssignments());
      dispatch(fetchAllTasks());

      // Reset form and modal state
      setShowModal(false);
      setEditMode(false);
      setNewTask({
        project: "",
        title: "",
        description: "",
        priority: "Low",
        category: "todo",
        user: "",
        dueDate: "",
      });
      setEditingTask({ task: null, sourceSetter: null });
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("There was an error saving the task. Please check your input.");
    }
  };

  // DRAG START
  const handleDragStart = (task, source) => {
    if (!hasPermission(permissions, "dashboard", "edit")) {
      alert("You don't have permission to move tasks.");
      return;
    }
    setDraggedTask({ task, source });
  };

  const handleDrop = async (targetCategory) => {
    if (!hasPermission(permissions, "dashboard", "edit")) {
      alert("You don't have permission to move tasks.");
      return;
    }

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
        {hasPermission(permissions, "dashboard", "create") && (
          <button
            className={styles.createButton}
            onClick={() => {
              setNewTask({
                project: "",
                title: "",
                description: "",
                priority: "Low",
                category: "todo",
                user: "",
                dueDate: "",
              });
              setEditMode(false);
              setEditingTask({ task: null, sourceSetter: null });
              setShowModal(true);
            }}
          >
            <img src="/create.png" alt="create" />
            Create Task
          </button>
        )}
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
                  onEdit={() => {
                    if (!hasPermission(permissions, "dashboard", "edit")) {
                      alert("You don't have permission to edit tasks.");
                      return;
                    }
                    setEditMode(true);
                    setShowModal(true);
                    setNewTask(task);
                    setEditingTask({ task });
                  }}
                  onDelete={async () => {
                    if (!hasPermission(permissions, "dashboard", "delete")) {
                      alert("You don't have permission to delete tasks.");
                      return;
                    }
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/tasks/${task._id}`
                      );

                      dispatch(fetchTaskAssignments());
                      dispatch(fetchAllTasks());
                    } catch (err) {
                      console.error("Error deleting task:", err);
                    }
                  }}
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
                  onEdit={() => {
                    if (!hasPermission(permissions, "dashboard", "edit")) {
                      alert("You don't have permission to edit tasks.");
                      return;
                    }
                    setEditMode(true);
                    setShowModal(true);
                    setNewTask(task);
                    setEditingTask({ task });
                  }}
                  onDelete={async () => {
                    if (!hasPermission(permissions, "dashboard", "delete")) {
                      alert("You don't have permission to delete tasks.");
                      return;
                    }
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/tasks/${task._id}`
                      );

                      dispatch(fetchTaskAssignments());
                      dispatch(fetchAllTasks());
                    } catch (err) {
                      console.error("Error deleting task:", err);
                    }
                  }}
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
                  onEdit={() => {
                    if (!hasPermission(permissions, "dashboard", "edit")) {
                      alert("You don't have permission to edit tasks.");
                      return;
                    }
                    setEditMode(true);
                    setShowModal(true);
                    setNewTask(task);
                    setEditingTask({ task });
                  }}
                  onDelete={async () => {
                    if (!hasPermission(permissions, "dashboard", "delete")) {
                      alert("You don't have permission to delete tasks.");
                      return;
                    }
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/tasks/${task._id}`
                      );

                      dispatch(fetchTaskAssignments());
                      dispatch(fetchAllTasks());
                    } catch (err) {
                      console.error("Error deleting task:", err);
                    }
                  }}
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

      {/* Task Modal */}
      {showModal && (
        <CreateTaskModal
          operation={editMode ? "Edit Task" : "Create Task"}
          newTask={newTask}
          onChange={handleInputChange}
          onClose={() => {
            setShowModal(false);
            setEditMode(false);
            setEditingTask(null);
          }}
          onSubmit={handleSubmitTask}
          onCloseTab={() => {
            setShowModal(false);
            setEditMode(false);
            setEditingTask(null);
          }}
          operationButton={editMode ? "Save Changes" : "Add Task"}
        />
      )}
      {viewingTask && (
        <ViewTask
          task={viewingTask}
          onCloseTab={() => {
            setViewingTask(false);
          }}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
