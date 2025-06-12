import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      // Store token in localStorage (or cookie)
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/dashboard/info");
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
          <h3>LOGIN TO YOUR AACCOUNT</h3>
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
