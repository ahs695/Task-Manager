import React, { useState, useEffect } from "react";
import styles from "./MyTasks.module.css";
import axios from "axios";
import TaskCard2 from "../AdminDashboard/TaskCard/TaskCard2";
import Filter from "./Filter/Filter";
import CreateTaskModal from "../AdminDashboard/Tasks/CreateTaskModal/CreateTask";

export default function MyTasks({
  allTasks,
  allUsers,
  fetchTasks,
  allProjects,
  taskAssignments,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(allTasks);
  const [intermediateTasks, setIntermediateTasks] = useState(allTasks); // holds tasks after filter but before search

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

  const getProjectNameById = (projectId) => {
    const project = allProjects.find((p) => p._id === projectId);
    return project ? project.projectName : "Unknown Project";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTask = async () => {
    try {
      const {
        creationTime,
        startedTime,
        reviewTime,
        completionTime,
        ...taskData
      } = newTask;

      if (!taskData.user) {
        taskData.user = null;
      }

      // Always create new task (no editMode logic)
      await axios.post(`http://localhost:5000/api/tasks`, taskData);

      await fetchTasks();
      setShowModal(false);
      setNewTask({
        project: "",
        title: "",
        description: "",
        priority: "Low",
        category: "todo",
        user: "",
      });
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("There was an error saving the task. Please check your input.");
    }
  };

  const getUserNameById = (userId) => {
    const user = allUsers.find((u) => u._id === userId);
    return user ? user.name : "Unassigned";
  };

  // Filter tasks by title based on searchQuery
  useEffect(() => {
    const searched = intermediateTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(searched);
  }, [searchQuery, intermediateTasks, allTasks]);

  // Sync intermediateTasks and filteredTasks with fresh allTasks
  useEffect(() => {
    setIntermediateTasks(allTasks);
    setFilteredTasks(
      allTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [allTasks]);

  return (
    <div className={styles.myTasks}>
      <div className={styles.myTasksTop}>
        <h2>My Tasks</h2>
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
            onClick={() => {
              setNewTask({
                project: "",
                title: "",
                description: "",
                priority: "Low",
                category: "todo",
                user: "",
              });
              setShowModal(true);
            }}
          >
            <img src="/create.png" alt="" />
            Create
          </button>

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
                <div key={task._id}>
                  <TaskCard2
                    project={getProjectNameById(task.project)}
                    title={task.title}
                    userName={getUserNameById(task.user)}
                    priority={task.priority}
                    dueDate={task.dueDate}
                  />
                </div>
              ))}
          </div>

          {/* IN PROGRESS */}
          <div className={styles.inProgressCards}>
            {filteredTasks
              .filter((task) => task.category === "inprogress")
              .map((task) => (
                <div key={task._id}>
                  <TaskCard2
                    project={getProjectNameById(task.project)}
                    title={task.title}
                    description={task.description}
                    userName={getUserNameById(task.user)}
                    dueDate={task.dueDate}
                    priority={task.priority}
                  />
                </div>
              ))}
          </div>

          {/* UNDER REVIEW */}
          <div className={styles.underReviewCards}>
            {filteredTasks
              .filter((task) => task.category === "underreview")
              .map((task) => (
                <div key={task._id}>
                  <TaskCard2
                    project={getProjectNameById(task.project)}
                    title={task.title}
                    description={task.description}
                    userName={getUserNameById(task.user)}
                    priority={task.priority}
                    dueDate={task.dueDate}
                  />
                </div>
              ))}
          </div>

          {/* COMPLETED */}
          <div className={styles.completedCards}>
            {filteredTasks
              .filter((task) => task.category === "completed")
              .map((task) => (
                <div key={task._id}>
                  <TaskCard2
                    project={getProjectNameById(task.project)}
                    title={task.title}
                    description={task.description}
                    userName={getUserNameById(task.user)}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    completedAt={task.completionTime}
                    isCompleted={true}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateTaskModal
          operation="Create Task"
          newTask={newTask}
          onChange={handleInputChange}
          onClose={() => {
            setShowModal(false);
          }}
          onSubmit={handleSubmitTask}
          onCloseTab={() => {
            setShowModal(false);
          }}
          operationButton="Add Task"
          allUsers={allUsers}
          allProjects={allProjects}
        />
      )}

      {showFilter && (
        <Filter
          allTasks={allTasks}
          setFilteredTasks={setIntermediateTasks} // filter goes here first
          onCloseTab={() => setShowFilter(false)}
          taskAssignments={taskAssignments}
          allProjects={allProjects}
          allUsers={allUsers}
        />
      )}
    </div>
  );
}
