import React, { useState, useEffect, useRef } from "react";

import "./FilterPopup.css";

const FilterPopup = ({ position, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose(); // Викликаємо onClose, якщо клік був поза попапом
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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
      <p className="filter-popup-button" onClick={onClose}>
        Sort A to Z
      </p>
      <p className="filter-popup-button" onClick={onClose}>
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
        <div className="checkbox-section-container">
          <label className="checkbox-container">
            <input type="checkbox" className="checkbox" />
            <span className="checkmark"></span>
          </label>
          <p className="answer-option">On track</p>
        </div>
        <div className="checkbox-section-container">
          <label className="checkbox-container">
            <input type="checkbox" className="checkbox" />
            <span className="checkmark"></span>
          </label>
          <p className="answer-option">Catching up</p>
        </div>
        <div className="checkbox-section-container">
          <label className="checkbox-container">
            <input type="checkbox" className="checkbox" />
            <span className="checkmark"></span>
          </label>
          <p className="answer-option">Falling behind</p>
        </div>
        <div className="checkbox-section-container">
          <label className="checkbox-container">
            <input type="checkbox" className="checkbox" />
            <span className="checkmark"></span>
          </label>
          <p className="answer-option">N/A</p>
        </div>
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
