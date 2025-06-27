import React, { useState, useEffect } from "react";
import styles from "./User.module.css";
import FilterUser from "./FilterUser/FilterUser";
import CreateOrEditUser from "./CreateUser/CreateOrEditUser";
import { useAuth } from "../../contexts/AuthContext";

export default function User({
  allUsers,
  fetchUsers,
  allProjects,
  taskAssignments,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [editUser, setEditUser] = useState(null);
  const { auth } = useAuth();

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      alert("User deleted successfully!");
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    setFilteredUsers(allUsers);
  }, [allUsers]);

  return (
    <div className={styles.user}>
      <div className={styles.userTop}>
        <h2>All Users</h2>
        <div className={styles.userOptions}>
          <button
            className={styles.userOption}
            onClick={() => setShowFilter(true)}
          >
            <img src="/filterab.png" alt="" />
            Filter
          </button>

          <button
            className={styles.userOption}
            onClick={() => setShowModal(true)}
          >
            <img src="/add-userab.png" alt="Create" />
            Create
          </button>
        </div>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role?.rolename || "N/A"}</td>
              <td>
                <img
                  className={styles.edImg}
                  title="Edit"
                  src="/edit.png"
                  alt="Edit"
                  onClick={() => {
                    setEditUser(user);
                    setShowModal(true);
                  }}
                />

                <img
                  src="/delete.png"
                  alt="Delete"
                  title="Delete"
                  onClick={() => handleDelete(user._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <CreateOrEditUser
          onCloseTab={() => {
            setShowModal(false);
            setEditUser(null);
          }}
          allUsers={allUsers}
          fetchUsers={fetchUsers}
          editUser={editUser}
        />
      )}

      {showFilter && (
        <FilterUser
          allUsers={allUsers}
          setFilteredUsers={setFilteredUsers}
          onCloseTab={() => setShowFilter(false)}
          taskAssignments={taskAssignments}
          allProjects={allProjects}
        />
      )}
    </div>
  );
}
