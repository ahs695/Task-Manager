import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../Redux/Tasks/taskSlice";
import projectsReducer from "../Redux/Projects/projectSlice";
import usersReducer from "../Redux/Users/userSlice";
import authReducer from "../Redux/Auth/authSlice";
import taskAssignmentReducer from "../Redux/TaskAssignments/taskAssignmentSlice";
import organizationReducer from "../Redux/Organizations/OrganizationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    projects: projectsReducer,
    users: usersReducer,
    taskAssignments: taskAssignmentReducer,
    organizations: organizationReducer,
  },
});

export default store;
