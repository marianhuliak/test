import React, { useState, useEffect, useRef } from "react";

const FilterPopup = ({ position, onClose, columnValues, onFilterApply }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const handleCheckboxChange = (value) => {
    setSelectedValues((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleSelectAll = () => {
    console.log(columnValues);
    setSelectedValues(columnValues);
  };

  const handleSelectNone = () => {
    setSelectedValues([]);
  };

  const filteredColumnValues = columnValues.filter((value) =>
    (typeof value === "string" && value !== "N/A" && value.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (typeof value === "number" && !isNaN(value) && value.toString().includes(searchTerm))
  );

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

  const handleSortChange = (order) => {
    setSortOrder(order);
    onFilterApply(selectedValues, order);
    console.log("Hellllo", selectedValues);
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
      <p
        className={`filter-popup-button ${sortOrder === "asc" ? "active" : ""}`}
        onClick={() => handleSortChange("asc")}
      >
        Sort A to Z
      </p>
      <p
        className={`filter-popup-button ${
          sortOrder === "desc" ? "active" : ""
        }`}
        onClick={() => handleSortChange("desc")}
      >
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
        <p className="filter-popup-selection-selected">
          {selectedValues.length} selected
        </p>
        <div className="filter-popup-selection-container">
          <p className="filter-popup-selection-select">Select:</p>
          <p className="filter-popup-selection-ALL" onClick={handleSelectAll}>
            ALL
          </p>
          <p className="filter-popup-selection-NONE" onClick={handleSelectNone}>
            NONE
          </p>
        </div>
      </div>

      <div className="filter-popup-checkboxes">
        {filteredColumnValues.map((value) => (
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
            setSelectedValues([]);
            setSortOrder("");
            onClose();
          }}
        >
          Discard
        </button>
        <button
          className="filter-popup-button-apply"
          onClick={() => {
            onFilterApply(selectedValues, sortOrder);
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
