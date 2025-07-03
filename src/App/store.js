import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../Redux/Tasks/taskSlice";
import projectsReducer from "../Redux/Projects/projectSlice";
import usersReducer from "../Redux/Users/userSlice";
import authReducer from "../Redux/Auth/authSlice";
import taskAssignmentReducer from "../Redux/TaskAssignments/taskAssignmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    projects: projectsReducer,
    users: usersReducer,
    taskAssignments: taskAssignmentReducer,
  },
});

export default store;
