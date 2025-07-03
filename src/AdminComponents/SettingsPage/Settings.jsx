import React, { useEffect, useState } from "react";
import styles from "./Settings.module.css";
import axios from "axios";

const allResources = [
  "Dashboard",
  "Calendar",
  "Timeline",
  "Task",
  "Project",
  "User",
  "Setting",
  "Profile",
];

const allActions = ["view", "create", "edit", "delete"];

// Define restrictions for each resource
const resourceRestrictions = {
  Task: ["view", "create"], // Only allow view and create
  Profile: ["view", "edit"], // Only allow view and edit
  Calendar: ["view"], // Only allow view
  Timeline: ["view"], // Only allow view
  Setting: [],
};

export default function Settings() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/roles")
      .then((res) => {
        const filteredRoles = res.data.filter((role) => {
          const name = role.rolename.toLowerCase();
          return name !== "superadmin" && name !== "user";
        });

        setRoles(filteredRoles);
        const admin = filteredRoles.find(
          (role) => role.rolename.toLowerCase() === "admin"
        );
        if (admin) {
          setSelectedRoleId(admin._id);
        }
      })
      .catch((err) => console.error("Axios error:", err));
  }, []);

  useEffect(() => {
    const role = roles.find((r) => r._id === selectedRoleId);
    if (role) {
      const map = {};
      for (const perm of role.permissions || []) {
        map[perm.resource] = perm.actions;
      }
      setRolePermissions(map);
    } else {
      setRolePermissions({});
    }
  }, [selectedRoleId, roles]);

  const toggleResource = (resource) => {
    setRolePermissions((prev) => {
      const allowedActions = resourceRestrictions[resource];

      if (allowedActions) {
        // For restricted resources
        const currentActions = prev[resource] || [];
        const allAllowedChecked = allowedActions.every((action) =>
          currentActions.includes(action)
        );

        const newPerms = { ...prev };
        if (allAllowedChecked) {
          delete newPerms[resource];
        } else {
          newPerms[resource] = [...allowedActions];
        }
        return newPerms;
      } else {
        // For unrestricted resources
        const allChecked = prev[resource]?.length === allActions.length;
        const newPerms = { ...prev };
        if (allChecked) {
          delete newPerms[resource];
        } else {
          newPerms[resource] = [...allActions];
        }
        return newPerms;
      }
    });
  };

  const toggleAction = (resource, action) => {
    // Check if action is allowed for this resource
    const allowedActions = resourceRestrictions[resource];
    if (allowedActions && !allowedActions.includes(action)) {
      return; // Skip if action is restricted
    }

    setRolePermissions((prev) => {
      const current = prev[resource] || [];
      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];

      const newPerms = { ...prev };
      if (updated.length === 0) {
        delete newPerms[resource];
      } else {
        newPerms[resource] = updated;
      }
      return newPerms;
    });
  };

  const handleUpdatePermissions = async () => {
    const updatedPermissions = Object.entries(rolePermissions).map(
      ([resource, actions]) => ({
        resource,
        actions,
      })
    );

    try {
      await axios.put(`http://localhost:5000/api/roles/${selectedRoleId}`, {
        permissions: updatedPermissions,
      });
      alert("Permissions updated successfully");
    } catch (error) {
      console.error("Failed to update permissions:", error);
      alert("Failed to update permissions");
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.orgSettings}>
        <h1>Permission Settings</h1>

        {/* Role Selector */}
        <label className={styles.roleLabel}>
          Select Role:
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
          >
            <option value="">-- Choose Role --</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.rolename}
              </option>
            ))}
          </select>
        </label>

        {/* Permissions Grid */}
        {selectedRoleId && (
          <>
            <div className={styles.permissionsGrid}>
              {allResources.map((resource) => {
                const selectedActions = rolePermissions[resource] || [];
                const isResourceChecked = resourceRestrictions[resource]
                  ? resourceRestrictions[resource].every((action) =>
                      selectedActions.includes(action)
                    )
                  : selectedActions.length === allActions.length;

                return (
                  <div key={resource} className={styles.resourceBlock}>
                    <label>
                      <input
                        type="checkbox"
                        checked={isResourceChecked}
                        onChange={() => toggleResource(resource)}
                      />
                      <strong>{resource}</strong>
                    </label>

                    <div className={styles.actionCheckboxes}>
                      {allActions.map((action) => {
                        const isDisabled =
                          resourceRestrictions[resource] &&
                          !resourceRestrictions[resource].includes(action);

                        return (
                          <label key={action}>
                            <input
                              type="checkbox"
                              checked={selectedActions.includes(action)}
                              onChange={() => toggleAction(resource, action)}
                              disabled={isDisabled}
                            />
                            {action}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className={styles.permButton}
              onClick={handleUpdatePermissions}
            >
              Update Permissions
            </button>
          </>
        )}
      </div>
    </div>
  );
}
