import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

function Register() {
  const [isOrgMode, setIsOrgMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleToggle = () => {
    setIsOrgMode((prev) => !prev);
    setData({ name: "", email: "", password: "" }); // reset on toggle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isOrgMode) {
        // Register organization
        await axios.post("http://localhost:5000/api/organizations", {
          orgName: data.name,
          email: data.email,
          password: data.password,
        });
        alert("Organization created successfully!");
      } else {
        // Register user
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          data
        );
        if (res.status === 201) {
          alert("User registered successfully!");
        }
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Registration failed. Try again with different credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.register}>
      <div className={styles.signinContainer}>
        <h1>Task Manager</h1>

        <div className={styles.registerMessage}>
          <h2>Welcome!</h2>
          <h3>
            {isOrgMode ? "REGISTER ORGANIZATION" : "REGISTER YOUR ACCOUNT"}
          </h3>
        </div>

        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <label>
            {isOrgMode ? "Organization Name:" : "Enter your Full Name:"}
          </label>
          <input
            type="text"
            placeholder={isOrgMode ? "Org Name" : "Full Name"}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <br />
          <br />

          <label>
            {isOrgMode ? "Org ID (Email):" : "Enter your Email Address:"}
          </label>
          <input
            type="email"
            placeholder="abc@xyz.com"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <br />
          <br />

          <label>
            {isOrgMode ? "Create Org Admin Password:" : "Create your Password:"}
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <br />
          <br />

          <button
            type="submit"
            className={styles.registerButton}
            disabled={isSubmitting}
          >
            {isOrgMode ? "Register Organization" : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", color: "black" }}>
          {isOrgMode
            ? "Want to register as a user?"
            : "Want to register an organization?"}{" "}
          <button
            type="button"
            onClick={handleToggle}
            className={styles.toggleButton}
          >
            Click here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
