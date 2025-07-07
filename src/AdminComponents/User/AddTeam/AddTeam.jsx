import React, { useState } from "react";
import styles from "./AddTeam.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllUsers,
  fetchUnassignedUsers,
} from "../../../Redux/Users/userAPI";

export default function AddTeam({ onCloseTab }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { unassignedUsers } = useSelector((state) => state.users);
  {
    console.log(unassignedUsers);
  }
  const [closing, setClosing] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [matchedUser, setMatchedUser] = useState(null);
  const [searchTouched, setSearchTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(() => {
      onCloseTab();
    }, 600);
  };

  const handleSearch = () => {
    setSearchTouched(true);
    const found = unassignedUsers.find(
      (user) => user.email.toLowerCase() === searchEmail.toLowerCase()
    );
    setMatchedUser(found || null);
  };

  const handleAddUser = async () => {
    if (!matchedUser) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/auth/assign-to-org/${matchedUser._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      alert("User added to your team successfully!");
      dispatch(fetchAllUsers());
      dispatch(fetchUnassignedUsers());
      onCloseTab();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addTeamOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.addTeam} ${
          closing ? styles.slideOut : styles.slideIn
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add User to Your Team</h2>

        <div className={styles.searchContainer}>
          <label>Enter Email</label>
          <div className={styles.search}>
            <input
              type="email"
              placeholder="Enter user email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onBlur={handleSearch}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        {searchTouched && (
          <div className={styles.result}>
            {matchedUser ? (
              <p>
                User found: <strong>{matchedUser.name}</strong>
              </p>
            ) : (
              <p>No user found with that email.</p>
            )}
          </div>
        )}

        <button
          className={styles.addBtn}
          onClick={handleAddUser}
          disabled={!matchedUser || loading}
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>
    </div>
  );
}
