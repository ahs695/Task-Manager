// Components/Organization/Organization.jsx
import React, { useState, useEffect } from "react";
import styles from "./Organization.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrganizations } from "../../Redux/Organizations/OrganizationAPI";
import CreateOrganization from "./CreateOrg/CreateOrganization";

export default function Organization() {
  const dispatch = useDispatch();
  const allOrganizations = useSelector(
    (state) => state.organizations.allOrganizations
  );

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrganizations());
  }, [dispatch]);

  return (
    <div className={styles.org}>
      <div className={styles.orgTop}>
        <h2>All Organizations</h2>
        <div className={styles.orgOptions}>
          <button className={styles.orgOption}>
            <img src="/filterab.png" alt="" />
            Filter
          </button>
          <button
            className={styles.orgOption}
            onClick={() => setShowModal(true)}
          >
            <img src="/add-userab.png" alt="Create" />
            Create
          </button>
        </div>
      </div>

      <table className={styles.orgTable}>
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {allOrganizations.map((org) => (
            <tr key={org._id}>
              <td>{org.name}</td>
              <td>{new Date(org.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <CreateOrganization onCloseTab={() => setShowModal(false)} />
      )}
    </div>
  );
}
