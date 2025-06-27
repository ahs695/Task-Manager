import React, { useState } from "react";
import styles from "./CreateUser.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";

export default function CreateOrEditUser({
  fetchUsers,
  onCloseTab,
  editUser = null,
}) {
  const { auth } = useAuth();

  const isEdit = Boolean(editUser);

  const [form, setForm] = useState({
    name: editUser?.name || "",
    role: editUser?.role || "user",
    customRole: "",
    email: editUser?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedRole =
      form.role === "custom" ? form.customRole.trim() : form.role;

    const predefinedRoles = ["superAdmin", "admin", "staff", "user"];
    if (
      form.role === "custom" &&
      predefinedRoles.includes(selectedRole.toLowerCase())
    ) {
      alert(
        `"${selectedRole}" is a reserved role and cannot be used as custom`
      );
      return;
    }

    if (!selectedRole) {
      alert("Please enter a valid role");
      return;
    }

    if (showPasswordFields && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/auth/${editUser._id}`,
          {
            name: form.name,
            role: selectedRole,
            ...(showPasswordFields && form.password
              ? { password: form.password }
              : {}),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        alert("User updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/auth/create-user",
          {
            name: form.name,
            role: selectedRole,
            email: form.email,
            password: form.password,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        alert("User created successfully!");
      }

      fetchUsers();
      onCloseTab();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit user");
    }
  };

  const roleOptions =
    auth.role === "superAdmin"
      ? ["superAdmin", "admin", "staff", "user", "custom"]
      : ["staff", "user", "custom"];

  const [closing, setClosing] = useState(false);

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(() => {
      onCloseTab(); // Only call after animation ends
    }, 600); // matches animation duration
  };

  return (
    <div className={styles.createUserOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.createUser} ${
          closing ? styles.slideOut : styles.slideIn
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{isEdit ? "Edit User" : "Create New User"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {isEdit ? (
            showPasswordFields ? (
              <>
                <label>
                  New Password:
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Confirm Password:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(false)}
                >
                  Cancel
                </button>
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
                  Role:
                  <select name="role" value={form.role} onChange={handleChange}>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>

                {form.role === "custom" && (
                  <label>
                    Custom Role:
                    <input
                      type="text"
                      name="customRole"
                      value={form.customRole}
                      onChange={handleChange}
                      required
                    />
                  </label>
                )}

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

                <button
                  type="button"
                  onClick={() => setShowPasswordFields(true)}
                >
                  Change Password
                </button>
              </>
            )
          ) : (
            <>
              <label>
                Password:
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
          )}

          <button type="submit">
            {isEdit ? "Update User" : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
