import React, { useState } from "react";
import styles from "./EditProfile.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../../Redux/Users/userAPI";

export default function EditProfile({
  onCloseTab,
  editUser = null,
  mode = "edit",
}) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isPasswordMode = mode === "password";

  const [form, setForm] = useState({
    name: editUser?.name || "",
    email: editUser?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPasswordMode) {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        await axios.put(
          `http://localhost:5000/api/auth/${editUser._id}`,
          { password: form.password },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        alert("Password changed successfully!");
        dispatch(fetchAllUsers());
        onCloseTab();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to change password");
      }
    } else {
      try {
        await axios.put(
          `http://localhost:5000/api/auth/${editUser._id}`,
          {
            name: form.name,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        alert("Profile updated successfully!");
        dispatch(fetchAllUsers());
        onCloseTab();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to update profile");
      }
    }
  };

  const [closing, setClosing] = useState(false);

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(() => {
      onCloseTab();
    }, 600);
  };

  return (
    <div className={styles.editProfileOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.editProfile} ${
          closing ? styles.slideOut : styles.slideIn
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{isPasswordMode ? "Change Password" : "Edit Profile"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {isPasswordMode ? (
            <>
              <label>
                New Password:
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Confirm Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </label>
            </>
          )}

          <button type="submit">
            {isPasswordMode ? "Change Password" : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
