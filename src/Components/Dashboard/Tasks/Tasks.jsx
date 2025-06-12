import React, { useState } from "react";
import styles from "./Tasks.module.css";
import TaskCard from "../TaskCard/TaskCard";
import CreateTaskModal from "./CreateTaskModal/CreateTask";

export default function Tasks({
  toDoTasks,
  setToDoTasks,
  inProgressTasks,
  setInProgressTasks,
  underReviewTasks,
  setUnderReviewTasks,
  completedTasks,
  setCompletedTasks,
}) {
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    label: "",
    title: "",
    description: "",
    priority: "",
    status: "To Do",
    creationTime: "",
  });

  //For edit:
  const [editMode, setEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState({
    task: null,
    sourceSetter: null,
  });

  const [draggedTask, setDraggedTask] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTask = () => {
    const timestamp = new Date().toLocaleString();
    const taskWithTime = {
      ...newTask,
      creationTime: timestamp,
    };
    if (editMode) {
      // Update the task in its original list
      editingTask.sourceSetter((prev) =>
        prev.map((t) => (t === editingTask.task ? newTask : t))
      );
    } else {
      // Add to To Do
      setToDoTasks((prev) => [...prev, taskWithTime]);
    }

    // Reset
    setNewTask({
      label: "",
      title: "",
      description: "",
      priority: "Low",
      status: "To Do",
      creationTime: "",
    });
    setShowModal(false);
    setEditMode(false);
    setEditingTask({ task: null, sourceSetter: null });
  };

  // DRAG START
  const handleDragStart = (task, source) => {
    setDraggedTask({ task, source });
    {
      console.log("drag started");
    }
  };

  // DROP LOGIC
  const handleDrop = (
    targetListSetter,
    targetList,
    targetStatus,
    targetSource
  ) => {
    if (!draggedTask) return;

    const { task, source } = draggedTask;

    // 🛑 Exit if source and target are same
    if (source === targetSource) {
      setDraggedTask(null);
      return;
    }

    // Remove from original list
    source((prev) => prev.filter((t) => t !== task));

    // Add to new list with updated status
    const updatedTask = { ...task, status: targetStatus };
    targetListSetter([...targetList, updatedTask]);
    {
      console.log("dropped");
    }
    setDraggedTask(null);
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className={styles.tasks}>
      <div className={styles.searchBar}>
        <div className={styles.search}>
          <img src="/search2.png" alt="" />
          <input type="text" placeholder="Search Task" />
        </div>
        <button
          className={styles.createButton}
          onClick={() => setShowModal(true)}
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
          onDrop={() =>
            handleDrop(setToDoTasks, toDoTasks, "To Do", setToDoTasks)
          }
        >
          {toDoTasks.map((task, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(task, setToDoTasks)}
            >
              <TaskCard
                label={task.label}
                title={task.title}
                description={task.description}
                creationTime={task.creationTime}
                priority={task.priority}
                onEdit={() => {
                  setEditMode(true);
                  setShowModal(true);
                  setNewTask(task); // Load task into modal
                  setEditingTask({ task, sourceSetter: setToDoTasks }); // Change for each list
                }}
                onDelete={() =>
                  setToDoTasks((prev) => prev.filter((t) => t !== task))
                }
              />
            </div>
          ))}
        </div>

        {/* IN PROGRESS */}
        <div
          className={styles.inProgressCards}
          onDragOver={allowDrop}
          onDrop={() =>
            handleDrop(
              setInProgressTasks,
              inProgressTasks,
              "In Progress",
              setInProgressTasks
            )
          }
        >
          {inProgressTasks.map((task, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(task, setInProgressTasks)}
            >
              <TaskCard
                label={task.label}
                title={task.title}
                description={task.description}
                creationTime={task.creationTime}
                priority={task.priority}
                onEdit={() => {
                  setEditMode(true);
                  setShowModal(true);
                  setNewTask(task); // Load task into modal
                  setEditingTask({ task, sourceSetter: setInProgressTasks }); // Change for each list
                }}
                onDelete={() =>
                  setInProgressTasks((prev) => prev.filter((t) => t !== task))
                }
              />
            </div>
          ))}
        </div>

        {/* UNDER REVIEW */}
        <div
          className={styles.underReviewCards}
          onDragOver={allowDrop}
          onDrop={() =>
            handleDrop(
              setUnderReviewTasks,
              underReviewTasks,
              "Under Review",
              setUnderReviewTasks
            )
          }
        >
          {underReviewTasks.map((task, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(task, setUnderReviewTasks)}
            >
              <TaskCard
                label={task.label}
                title={task.title}
                description={task.description}
                creationTime={task.creationTime}
                priority={task.priority}
                onEdit={() => {
                  setEditMode(true);
                  setShowModal(true);
                  setNewTask(task); // Load task into modal
                  setEditingTask({ task, sourceSetter: setUnderReviewTasks }); // Change for each list
                }}
                onDelete={() =>
                  setUnderReviewTasks((prev) => prev.filter((t) => t !== task))
                }
              />
            </div>
          ))}
        </div>

        {/* COMPLETED */}
        <div
          className={styles.completedCards}
          onDragOver={allowDrop}
          onDrop={() =>
            handleDrop(
              setCompletedTasks,
              completedTasks,
              "Completed",
              setCompletedTasks
            )
          }
        >
          {completedTasks.map((task, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(task, setCompletedTasks)}
            >
              <TaskCard
                label={task.label}
                title={task.title}
                description={task.description}
                creationTime={task.creationTime}
                priority={task.priority}
                onEdit={() => {
                  setEditMode(true);
                  setShowModal(true);
                  setNewTask(task); // Load task into modal
                  setEditingTask({ task, sourceSetter: setCompletedTasks }); // Change for each list
                }}
                onDelete={() => {
                  alert("You can not delete a Completed Task");
                }}
              />
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}
