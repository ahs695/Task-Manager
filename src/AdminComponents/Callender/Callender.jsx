import React, { useState, useEffect, useRef } from "react";
import styles from "./Callender.module.css";
import DateBox from "./DateBox/DateBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Callender({ allTasks, allProjects, taskAssignments }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const datesContainerRef = useRef(null);
  const todayBoxRef = useRef(null);

  const isFutureDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  const isSameDay = (d1, d2) =>
    d1?.getFullYear() === d2?.getFullYear() &&
    d1?.getMonth() === d2?.getMonth() &&
    d1?.getDate() === d2?.getDate();

  const generateDatesArray = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      return { dayName, dateObj: date, date: index + 1 };
    });
  };

  const datesArray = generateDatesArray(currentYear, currentMonth);

  const goToPrevYear = () => setCurrentYear((prev) => prev - 1);
  const goToNextYear = () => setCurrentYear((prev) => prev + 1);

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
    setSelectedDate(null);
  };

  const handleDateClick = (dateObj) => setSelectedDate(dateObj);

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  // === Derived Data ===
  const filteredProjects = selectedDate
    ? allProjects.filter(
        (project) =>
          isSameDay(new Date(project.creationTime), selectedDate) ||
          isSameDay(new Date(project.completionTime), selectedDate) ||
          (new Date(project.creationTime) <= selectedDate &&
            (!project.completionTime ||
              new Date(project.completionTime) > selectedDate))
      )
    : [];

  const futureOnly = isFutureDate(selectedDate);

  const tasksDueOnSelectedDate = allTasks.filter((t) =>
    isSameDay(new Date(t.dueDate), selectedDate)
  );

  const getProjectTasks = (project) => {
    const projectIdStr = project._id.toString();

    // Handle populated taskAssignments (from backend .populate())
    const taskIds = taskAssignments
      .filter((ta) => {
        // Check populated projectId object
        return ta.projectId?._id?.toString() === projectIdStr;
      })
      .map((ta) => {
        // Get taskId (handling populated or raw ID)
        return ta.taskId?._id?.toString() || ta.taskId?.toString();
      })
      .filter(Boolean); // Remove any undefined/null

    return allTasks.filter(
      (task) =>
        taskIds.includes(task._id.toString()) &&
        task.category?.toLowerCase().trim() !== "completed"
    );
  };

  useEffect(() => {
    if (todayBoxRef.current && datesContainerRef.current) {
      const container = datesContainerRef.current;
      const box = todayBoxRef.current;

      // Center the box in the scroll container
      container.scrollLeft =
        box.offsetLeft - container.offsetWidth / 2 + box.offsetWidth / 2;
    }
  }, [currentMonth, currentYear]);

  return (
    <div className={styles.callender}>
      <div className={styles.calTop}>
        <h2>Calendar</h2>
        <div className={styles.calOptions}>
          <button
            className={styles.calOption}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <img src="/filterab.png" alt="" />
            Pick Date
          </button>

          {showDatePicker && (
            <div
              style={{
                position: "absolute",
                zIndex: 9999,
                top: "90px",
                left: "1000px",
                marginTop: "8px",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
              }}
            >
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  if (!date) return;
                  setShowDatePicker(false);
                  setSelectedDate(date);
                  setCurrentMonth(date.getMonth());
                  setCurrentYear(date.getFullYear());
                }}
                inline
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.timelineContainer}>
        <div className={styles.daysManipulation}>
          <div className={styles.calButtons}>
            <button onClick={goToPrevYear}>&#60;&#60;</button>
            <button onClick={goToPrevMonth}>&#60;</button>
          </div>
          <h2>
            {monthName}, {currentYear}
          </h2>
          <div className={styles.calButtons}>
            <button onClick={goToNextMonth}>&#62;</button>
            <button onClick={goToNextYear}>&#62;&#62;</button>
          </div>
        </div>

        <div className={styles.dates} ref={datesContainerRef}>
          {datesArray.map((d, i) => {
            const dateObj = new Date(currentYear, currentMonth, d.date);
            const isSelected =
              selectedDate &&
              dateObj.toDateString() === selectedDate.toDateString();

            return (
              <DateBox
                key={i}
                dayName={d.dayName}
                date={d.date}
                onClick={() => handleDateClick(dateObj)}
                isSelected={isSelected}
                ref={isSameDay(dateObj, today) ? todayBoxRef : null}
              />
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className={styles.dateData}>
          <div className={styles.headData}>
            <h1>
              {selectedDate.getDate()} {monthName} {selectedDate.getFullYear()}:
            </h1>
            <p className={styles.projectStats}>
              Created :{" "}
              {
                allProjects.filter((p) =>
                  isSameDay(new Date(p.creationTime), selectedDate)
                ).length
              }{" "}
            </p>
            <p className={styles.projectStats}>
              Completed :{" "}
              {
                allProjects.filter((p) =>
                  isSameDay(new Date(p.completionTime), selectedDate)
                ).length
              }{" "}
            </p>
          </div>
          {futureOnly ? (
            <>
              <p className={styles.futureData}>
                Due Tasks: {tasksDueOnSelectedDate.length}
              </p>
              <ul>
                {tasksDueOnSelectedDate.map((task, idx) => {
                  const assignment = taskAssignments.find(
                    (ta) =>
                      (ta.taskId?._id?.toString() || ta.taskId?.toString()) ===
                      task._id.toString()
                  );
                  const project =
                    assignment &&
                    allProjects.find(
                      (p) =>
                        (assignment.projectId?._id?.toString() ||
                          assignment.projectId?.toString()) === p._id.toString()
                    );

                  return (
                    <li key={idx} className={styles.futureData}>
                      {task.title}
                      {project ? ` (from "${project.projectName}")` : ""}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              {filteredProjects.map((project, idx) => {
                const projectIdStr = project._id.toString();

                const taskIds = taskAssignments
                  .filter(
                    (ta) =>
                      ta.projectId?._id?.toString() === projectIdStr ||
                      ta.projectId?.toString() === projectIdStr
                  )
                  .map(
                    (ta) => ta.taskId?._id?.toString() || ta.taskId?.toString()
                  );

                const tasksForProject = allTasks.filter((task) =>
                  taskIds.includes(task._id.toString())
                );

                const tasksCreatedToday = tasksForProject.filter((task) =>
                  isSameDay(new Date(task.creationTime), selectedDate)
                );

                const tasksDueToday = tasksForProject.filter((task) =>
                  isSameDay(new Date(task.dueDate), selectedDate)
                );

                if (
                  tasksCreatedToday.length === 0 &&
                  tasksDueToday.length === 0
                )
                  return null;

                return (
                  <div className={styles.tasksOfProject} key={idx}>
                    <p>
                      <strong>{project.projectName}</strong>
                    </p>

                    {/* ✅ Only render if tasks exist */}
                    {tasksCreatedToday.length > 0 && (
                      <div className={styles.tasksToday}>
                        <p>Tasks Created Today:</p>
                        <ul>
                          {tasksCreatedToday.map((t) => (
                            <li key={t._id}>{t.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {tasksDueToday.length > 0 && (
                      <div className={styles.dueTask}>
                        <p>Tasks Due Today:</p>
                        <ul>
                          {tasksDueToday.map((t) => (
                            <li key={t._id}>{t.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
