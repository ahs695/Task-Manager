// Components/Organization/CreateOrganization/CreateOrganization.jsx
import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateOrganization.module.css";
import { useDispatch } from "react-redux";
import { fetchAllOrganizations } from "../../../Redux/Organizations/OrganizationAPI";

export default function CreateOrganization({ onCloseTab }) {
  const dispatch = useDispatch();
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleOverlayClick = () => {
    setClosing(true);
    setTimeout(onCloseTab, 600);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orgName.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:5000/api/organizations", {
        orgName,
        email,
        password,
      });

      alert("Organization created successfully!");
      dispatch(fetchAllOrganizations());
      onCloseTab();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createOrgOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.createOrg} ${
          closing ? styles.slideOut : styles.slideIn
        }`}
        onClick={stopPropagation}
      >
        <h2>Create New Organization</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Organization Name:
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </label>
          <label>
            Org ID:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            Create Organization
          </button>
        </form>
      </div>
    </div>
  );
}
