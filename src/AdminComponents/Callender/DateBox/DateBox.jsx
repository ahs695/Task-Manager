import React from "react";
import styles from "./DateBox.module.css";

// Wrap component with forwardRef to allow passing refs from parent
const DateBox = React.forwardRef(
  ({ dayName, date, onClick, isSelected }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.dateBox} ${isSelected ? styles.selected : ""}`}
        onClick={onClick}
      >
        <p>{dayName}</p>
        <h3>{date}</h3>
      </div>
    );
  }
);

export default DateBox;
