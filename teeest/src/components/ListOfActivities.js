import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterPopup from "./FilterPopup.js";

import logo from "../img/Logo.svg";
import buttonRight from "../img/lists-button-right.svg";
import buttonLeft from "../img/lists-button-left.svg";
import plus from "../img/plus-for-list-of-activities.svg";
import lockIcon from "../img/lock-icon.svg";
import filterIcon from "../img/filter-icon.svg";
import launchLiveActivities from "../img/launch-live-activities.svg";
import gameMoch from "../img/game-mock.svg";

import "../styles/ListOfActivities.css";
import "../styles/FilterPopup.css";

const API_BASE_URL =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/activity?activityId=all";

const ListOfActivities = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [sortOrder, setSortOrder] = useState("");
  const [sortedColumn, setSortedColumn] = useState("");
  const [temporarySortedColumn, setTemporarySortedColumn] = useState("");

  const [filters, setFilters] = useState({
    languageElements: [],
    primarySkills: [],
    requiredTime: [],
  });

  function uniqueColumnValues(data, column) {
    return [...new Set(data.map((item) => item[column]))];
  }

  const handleFilterClick = (e, columnName) => {
    ////
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setPopupVisible(true);
    setTemporarySortedColumn(columnName);
    if (
      columnName === "languageElements" ||
      columnName === "primarySkills" ||
      columnName === "requiredTime"
    ) {
      setUniqueStatuses(uniqueColumnValues(activities, columnName));
    } else {
      setUniqueStatuses([]);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setActivities(response.data.activities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activ) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesPrimarySkills = activ.primarySkills.some((skill) =>
      skill.toLowerCase().includes(searchLower)
    );

    const matchesFilters = (columnName, selectedValues) => {
      if (selectedValues.length > 0) {
        return selectedValues.some((filterValue) => {
          const columnValue = activ[columnName];

          if (typeof columnValue === "number") {
            return columnValue === filterValue;
          }

          if (typeof columnValue === "string") {
            return columnValue
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
          return false;
        });
      }
      return true;
    };

    const matchesLanguageElements = matchesFilters(
      "languageElements",
      filters.languageElements
    );
    const matchesPrimarySkillsFilter = matchesFilters(
      "primarySkills",
      filters.primarySkills
    );
    const matchesRequiredTime = matchesFilters(
      "requiredTime",
      filters.requiredTime
    );

    return (
      matchesPrimarySkills &&
      matchesLanguageElements &&
      matchesPrimarySkillsFilter &&
      matchesRequiredTime
    );
  });

  const sortActivities = (activities) => {
    if (sortedColumn && sortOrder) {
      return [...activities].sort((a, b) => {
        let valueA = a[sortedColumn];
        let valueB = b[sortedColumn];

        if (
          valueA instanceof Date ||
          valueB instanceof Date ||
          !isNaN(Date.parse(valueA)) ||
          !isNaN(Date.parse(valueB))
        ) {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (!isNaN(valueA) && !isNaN(valueB)) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return activities;
  };

  const sortedActivities = sortActivities(filteredActivities);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedActivities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < filteredActivities.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleFilterApply = (selectedValues, selectedSortOrder) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [temporarySortedColumn]: selectedValues,
    }));
    setSortedColumn(temporarySortedColumn);
    setSortOrder(selectedSortOrder);  // Зміна: одразу застосовуємо сортування
  };

  return (
    <div className="list-of-activities">
      <div className="header">
        <div className="header-logo">
          <img src={logo} alt="logo" className="header-logo-img" />
          <p className="header-logo-text">Activities</p>
        </div>
        <div className="header-login">log in</div>
      </div>

      <div className="content">
        <div className="container">
          <div className="content-container">
            <div className="content-top">
              <div className="content-top-search">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by primary skill..."
                  className="content-top-search-input"
                />
              </div>
            </div>

            <div className="content-pagination">
              <p className="content-pagination-info">
                {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredActivities.length)}{" "}
                of {filteredActivities.length}
              </p>
              <img
                src={buttonLeft}
                alt="buttonLeft"
                className="content-pagination-button left-button"
                onClick={handlePreviousPage}
              />
              <img
                src={buttonRight}
                alt="buttonRight"
                className="content-pagination-button right-button"
                onClick={handleNextPage}
              />
            </div>
          </div>
          <div className="activities-table-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <table className="activities-table">
                <thead>
                  <tr>
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "languageElements")}
                    >
                      Language Elements{" "}
                      {(sortedColumn === "languageElements" && sortOrder) ||
                      (filters.languageElements &&
                        filters.languageElements.length > 0) ? (
                          
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>

                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "primarySkills")}
                    >
                      Primary Skills{" "}
                      {(sortedColumn === "primarySkills" && sortOrder) ||
                      (filters.primarySkills &&
                        filters.primarySkills.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>

                    <th id="table-text">
                      Class{" "}
                      <img
                        src={lockIcon}
                        className={"lock-icon"}
                        alt="lockIcon"
                      />
                    </th>
                    {/*              */}
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "dueOn")}
                    >
                      Game{" "}
                      {(sortedColumn === "dueOn" && sortOrder) ||
                      (filters.dueOn && filters.dueOn.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>

                    {/*              */}

                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "requiredTime")}
                    >
                      Time required{" "}
                      {(sortedColumn === "requiredTime" && sortOrder) ||
                      (filters.requiredTime &&
                        filters.requiredTime.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>

                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "completionRate")}
                    >
                      Launch Live activities{" "}
                      {(sortedColumn === "completionRate" && sortOrder) ||
                      (filters.completionRate &&
                        filters.completionRate.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "add")}
                    >
                      Add to Homework
                      {(sortedColumn === "add" && sortOrder) ||
                      (filters.completionRate &&
                        filters.completionRate.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((activ) => (
                    <tr key={activ.id}>
                      <td>
                        <p className={"language-elements"}>
                          {activ.languageElements}
                        </p>
                      </td>

                      <td>{activ.primarySkills.join(", ")}</td>
                      <td>{activ.assignedTo.join(", ")}</td>
                      <td>
                        <img src={gameMoch} />
                      </td>

                      <td>
                        {activ.requiredTime}
                        {" Min"}
                      </td>

                      <td>
                        {" "}
                        <img src={launchLiveActivities} />
                      </td>

                      <td>{<img src={plus} alt="Plus" />} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {popupVisible && (
        <FilterPopup
          position={popupPosition}
          onClose={() => setPopupVisible(false)}
          onSortChange={(order) => {
            setSortOrder(order);
            setPopupVisible(false);
          }}
          sortedColumn={sortedColumn}
          columnValues={uniqueStatuses}
          onFilterApply={handleFilterApply}
          columnName="columnName" 
        />
      )}
    </div>
  );
};

export default ListOfActivities;
