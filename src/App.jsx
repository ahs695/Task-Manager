import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import Home from "./Components/Home/Home";
import Header from "./Components/Header/header";
import Footer from "./Components/Footer/Footer";
import AdminDashboard from "./AdminComponents/AdminDashboard/AdminDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// ProtectedRoute component
function ProtectedRoute({ allowedRoles }) {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  console.log("auth.role after: ", auth.role);
  if (!allowedRoles.includes(auth.role)) {
    console.log("auth.role :", auth.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Wrapper to conditionally show header/footer
function AppContent() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin-dashboard");

  return (
    <>
      {!isDashboardRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route for regular users */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>

        {/* Protected Route for admins */}
        <Route
          element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]} />}
        >
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
