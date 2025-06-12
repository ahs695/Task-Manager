import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Registration failed. Try again with a different email."
      );
    }
  };

  return (
    <div className={styles.register}>
      <div className={styles.signinContainer}>
        <h1>Task Manager</h1>

        <div className={styles.registerMessage}>
          <h2>Welcome!</h2>
          <h3>REGISTER YOUR AACCOUNT</h3>
        </div>
        <form className={styles.registerForm} onSubmit={handleRegister}>
          <label>Enter your Full Name:</label>
          <input
            type="text"
            placeholder="Full-Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <br />
          <br />
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
          <label for="r_password">Create your Password:</label>
          <input
            type="password"
            id="r_password"
            name="pass"
            placeholder="Enter Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <br />
          <br />
          <button class={styles.registerButton}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
