import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Auth/authAPI";
import styles from "./Login.module.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role, status, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (status === "succeeded" && isAuthenticated && role) {
      if (role === "user") {
        navigate("/dashboard/info");
      } else {
        navigate("/admin-dashboard/info");
      }
    }
  }, [status, isAuthenticated, role, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(data));
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <h1>Task Manager</h1>
        <div className={styles.loginMessage}>
          <h2>Welcome Back!</h2>
          <h3>LOGIN TO YOUR ACCOUNT</h3>
        </div>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label>Enter your Email Address:</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
          <br />
          <br />
          <label>Enter your Password:</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
          <br />
          <br />
          <button type="submit" className={styles.loginButton}>
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>
        {status === "failed" && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
