import React, { useState, useEffect } from "react";
import styles from "./User.module.css";
import FilterUser from "./FilterUser/FilterUser";
import CreateOrEditUser from "./CreateUser/CreateOrEditUser";
import AddTeam from "./AddTeam/AddTeam";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../Redux/Users/userAPI";
import { hasPermission } from "../../App/Utility/permission";

export default function User() {
  const permissions = useSelector((state) => state.auth.permissions);
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users.allUsers);
  const { unassignedUsers, unassignedStatus, unassignedError } = useSelector(
    (state) => state.users
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState("");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [editUser, setEditUser] = useState(null);
  const auth = useSelector((state) => state.auth);
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
      dispatch(fetchAllUsers()); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    setFilteredUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    const searched = allUsers.filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(searched);
  }, [searchQuery, allUsers]);

  const role = useSelector((state) => state.auth.role);
  const shouldAddtoTeam = role === "organization";
  return (
    <div className={styles.user}>
      <div className={styles.userTop}>
        <h2>All Users</h2>
        <div className={styles.userOptions}>
          <div className={styles.userOption}>
            <img src="/searchab.png" alt="" />
            <input
              type="text"
              placeholder="Search user"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className={styles.userOption}
            onClick={() => setShowFilter(true)}
          >
            <img src="/filterab.png" alt="" />
            Filter
          </button>

          <button
            className={styles.userOption}
            onClick={() => {
              if (!hasPermission(permissions, "user", "create")) {
                alert("You do not have permission to create users.");
                return;
              }
              setEditUser(null);
              setUserModalMode("create");
              setShowModal(true);
            }}
          >
            <img src="/add-userab.png" alt="Create" />
            Create
          </button>

          {shouldAddtoTeam && (
            <button
              className={styles.userOption}
              onClick={() => {
                if (!hasPermission(permissions, "user", "create")) {
                  alert("You do not have permission to add users.");
                  return;
                }

                setShowAddTeamModal(true);
              }}
            >
              <img src="/add-userab.png" alt="Create" />
              Add to Team
            </button>
          )}
        </div>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {role === "superAdmin" && <th>Organization</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role?.rolename || "N/A"}</td>
              {role === "superAdmin" && (
                <td>
                  {user.organization?.name
                    ? user.organization.name
                    : user.organizations && user.organizations.length > 0
                    ? user.organizations
                        .map((org) => org?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "N/A"}
                </td>
              )}
              <td>
                <img
                  className={styles.edImg}
                  title="Edit"
                  src="/edit.png"
                  alt="Edit"
                  onClick={() => {
                    if (!hasPermission(permissions, "user", "edit")) {
                      alert("You do not have permission to edit users.");
                      return;
                    }
                    setEditUser(user);
                    setShowModal(true);
                    setUserModalMode("edit");
                  }}
                />

                <img
                  src="/delete.png"
                  alt="Delete"
                  title="Delete"
                  onClick={() => {
                    if (!hasPermission(permissions, "user", "delete")) {
                      alert("You do not have permission to delete users.");
                      return;
                    }
                    handleDelete(user._id);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <CreateOrEditUser
          mode={userModalMode}
          onCloseTab={() => {
            setShowModal(false);
            setEditUser(null);
          }}
          editUser={editUser}
        />
      )}
      {showAddTeamModal && (
        <AddTeam
          onCloseTab={() => {
            setShowAddTeamModal(false);
          }}
        />
      )}

      {showFilter && (
        <FilterUser
          setFilteredUsers={setFilteredUsers}
          onCloseTab={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
