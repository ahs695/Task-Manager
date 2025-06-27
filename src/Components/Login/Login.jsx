import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";
import axios from "axios";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      const token = res.data.token;

      // Store token
      localStorage.setItem("token", token);

      // Decode and update auth context
      const decoded = jwtDecode(token);
      setAuth({
        isAuthenticated: true,
        role: decoded.role,
        token,
      });

      // Redirect based on role
      if (decoded.role === "user") {
        navigate("/dashboard/info");
      } else {
        navigate("/admin-dashboard/info");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
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
            name="email"
            placeholder="abc@xyz.com"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <br />
          <br />
          <label>Enter your Password:</label>
          <input
            type="password"
            name="pass"
            placeholder="Enter Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <br />
          <br />
          <button className={styles.loginButton}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
