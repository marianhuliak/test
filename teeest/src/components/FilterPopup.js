import React, { useState, useEffect, useRef, onResetFilters } from "react";

const FilterPopup = ({
  position,
  onClose,
  onSortChange,
  columnValues,
  onFilterApply,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleCheckboxChange = (value) => {
    setSelectedValues((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
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
      <p className="filter-popup-button" onClick={() => onSortChange("asc")}>
        Sort A to Z
      </p>
      <p className="filter-popup-button" onClick={() => onSortChange("desc")}>
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
      <div className="filter-popup-checkboxes">
        {columnValues
          .filter((value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((value) => (
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
      <div className="filter-popup-actions">
        <button
          className="filter-popup-button-discard"
          onClick={() => {
            onResetFilters(); 
            onClose(); 
          }}
        >
          Discard
        </button>
        <button
          className="filter-popup-button-apply"
          onClick={() => {
            onFilterApply(selectedValues);
            onClose();
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;