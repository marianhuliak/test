import React, { useState, useEffect, useRef } from "react";

import "../styles/FilterPopup.css";


const FilterPopup = ({ position, onClose, onSortChange, columnValues }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);
  const [selectedValues, setSelectedValues] = useState([]);
  
  



  const handleCheckboxChange = (value) => {
    setSelectedValues((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value) // Видалення зі списку
        : [...prevSelected, value] // Додавання до списку
    );
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSort = (order) => {
    onSortChange(order);
    onClose();
  };

  return (
    <div
      ref={popupRef}
      className="popup"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        position: "absolute",
        backgroundColor: "white",
        zIndex: 10,
      }}
    >
      <p className="filter-popup-button" onClick={() => handleSort("asc")}>
        Sort A to Z
      </p>
      <p className="filter-popup-button" onClick={() => handleSort("desc")}>
        Sort Z to A
      </p>
      <div className="popup-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="popup-search-input"
        />
      </div>

      <div className="filter-popup-selection">
        <p className="filter-popup-selection-selected">7 selected</p>
        <div className="filter-popup-selection-container">
          <p className="filter-popup-selection-select">Select:</p>
          <p className="filter-popup-selection-ALL">ALL</p>
          <p className="filter-popup-selection-NONE">NONE</p>
        </div>
      </div>

      <div className="filter-popup-line"></div>

      <div className="filter-popup-checkboxes">
      {columnValues.map((value) => (
        <div className="checkbox-section-container" key={value}>
          <label className="checkbox-container">
            <input
              type="checkbox"
              className="checkbox"
              value={value}
              checked={selectedValues.includes(value)}
              onChange={() => handleCheckboxChange(value)}
            />
            <span className="checkmark"></span>
          </label>
          <p className="answer-option">{value}</p>
        </div>
      ))}
    </div>

      <div className="filter-popup-line" style={{ marginTop: "35px" }}></div>
      <div className="filter-popup-actions">
        <button className="filter-popup-button-discard" onClick={onClose}>
          Discard
        </button>
        <button className="filter-popup-button-apply" onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;
