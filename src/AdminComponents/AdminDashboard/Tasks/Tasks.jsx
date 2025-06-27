import React, { useState } from "react";
import styles from "./Tasks.module.css";
import TaskCard from "../TaskCard/TaskCard";
import CreateTaskModal from "./CreateTaskModal/CreateTask";
import ViewTask from "./ViewTaskModal/ViewTask";
import axios from "axios";

export default function Tasks({
  allTasks,
  fetchTasks,
  setDelCount,
  allUsers,
  allProjects,
}) {
  const [showModal, setShowModal] = useState(false);

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
      await axios.put(`http://localhost:5000/api/tasks/${viewingTask._id}`, {
        comments: [...viewingTask.comments, commentText],
      });

      setViewingTask((prev) => ({
        ...prev,
        comments: updatedComments,
      }));

      await fetchTasks();
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
      // Prepare task data (exclude creationTime)
      const {
        _id,
        creationTime,
        startedTime,
        reviewTime,
        completionTime,
        ...taskData
      } = newTask;

      const taskDataToSubmit = { ...taskData };

      // Convert empty user string to null
      if (!taskDataToSubmit.user) {
        taskData.user = null;
      }

      if (editMode && _id) {
        // Update existing task
        await axios.put(`http://localhost:5000/api/tasks/${_id}`, taskData);
      } else {
        // Create new task
        console.log(taskData);
        await axios.post(`http://localhost:5000/api/tasks`, taskData);
      }
      await fetchTasks();
      // Reset modal and task form
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
    setDraggedTask({ task, source });
    {
      console.log("drag started");
    }
  };

  // DROP LOGIC
  const handleDrop = async (targetCategory) => {
    if (!draggedTask) return;

    const { task } = draggedTask;

    if (task.category === targetCategory) {
      setDraggedTask(null);
      return;
    }

    // Prepare time updates
    const timeUpdate = {};
    if (targetCategory === "inprogress" && !task.startedTime) {
      timeUpdate.startedTime = new Date();
    } else if (targetCategory === "underreview" && !task.reviewTime) {
      timeUpdate.reviewTime = new Date();
    } else if (targetCategory === "completed" && !task.completionTime) {
      timeUpdate.completionTime = new Date();
    }

    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
        ...task,
        category: targetCategory,
        ...timeUpdate,
      });

      await fetchTasks(); // Refresh task list after updating
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
                    setEditMode(true);
                    setShowModal(true);
                    setNewTask(task);
                    setEditingTask({ task });
                  }}
                  onDelete={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/tasks/${task._id}`
                      );
                      setDelCount((prev) => prev + 1);
                      fetchTasks(); // Refresh after deletion
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
                    setEditMode(true);
                    setShowModal(true);
                    setNewTask(task);
                    setEditingTask({ task });
                  }}
                  onDelete={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/tasks/${task._id}`
                      );
                      setDelCount((prev) => prev + 1);

                      fetchTasks(); // Refresh after deletion
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
                    setEditMode(true);
                    setShowModal(true);
                    setNewTask(task);
                    setEditingTask({ task });
                  }}
                  onDelete={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/tasks/${task._id}`
                      );
                      setDelCount((prev) => prev + 1);

                      fetchTasks(); // Refresh after deletion
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
          allUsers={allUsers}
          allProjects={allProjects}
        />
      )}
      {viewingTask && (
        <ViewTask
          task={viewingTask}
          onCloseTab={() => {
            setViewingTask(false);
          }}
          onAddComment={handleAddComment}
          allProjects={allProjects}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}
