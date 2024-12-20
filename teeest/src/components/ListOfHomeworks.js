import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterPopup from "./FilterPopup.js";

import logo from "../img/Logo.svg";
import buttonRight from "../img/lists-button-right.svg";
import buttonLeft from "../img/lists-button-left.svg";
import lockIcon from "../img/lock-icon.svg";
import filterIcon from "../img/filter-icon.svg";
import "../img/Logo.svg";
import "../styles/ListOfHomeworks.css";

const API_BASE_URL =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api";

const ListOfHomeworks = () => {
  const [homeworks, setHomeworks] = useState([]);
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
    status: [],
    type: [],
  });

  function uniqueColumnValues(data, column) {
    return [...new Set(data.map((item) => item[column]))];
  }

  const handleFilterClick = (e, columnName) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setPopupVisible(true);
    setTemporarySortedColumn(columnName);
    if (columnName === "status" || columnName === "type") {
      setUniqueStatuses(uniqueColumnValues(homeworks, columnName));
    } else {
      setUniqueStatuses([]);
    }
  };

  const fetchHomeworks = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/homework?homeworkId=all`
      );
      setHomeworks(response.data.homeworks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching homeworks:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const filteredHomeworks = homeworks.filter((hw) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesTitle = hw.status.toLowerCase().includes(searchLower);
    const matchesDate =
      searchLower.length >= 3 &&
      (formatDate(hw.createdAt).toLowerCase().includes(searchLower) ||
        formatDate(hw.dueDate).toLowerCase().includes(searchLower));

    const matchesPopupFilter =
      (filters.status.length === 0 || filters.status.includes(hw.status)) &&
      (filters.type.length === 0 || filters.type.includes(hw.type));

    return (matchesTitle || matchesDate) && matchesPopupFilter;
  });

  const sortHomeworks = (homeworks) => {
    if (sortedColumn && sortOrder) {
      return [...homeworks].sort((a, b) => {
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
    return homeworks;
  };

  const sortedHomeworks = sortHomeworks(filteredHomeworks);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedHomeworks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < filteredHomeworks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const handleFilterApply = (selectedValues, selectedSortOrder) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [temporarySortedColumn]: selectedValues,
    }));
    setSortedColumn(temporarySortedColumn);
    setSortOrder(selectedSortOrder); 
  };

  
  return (
    <div className="list-of-homeworks">
      <div className="header">
        <div className="header-logo">
          <img src={logo} alt="logo" className="header-logo-img" />
          <p className="header-logo-text">Homeworks</p>
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
                  placeholder="Search by title..."
                  className="content-top-search-input"
                />
              </div>
              <div className="content-top-button">
                <button className="content-top-add-button">ADD HOMEWORK</button>
              </div>
            </div>

            <div className="content-pagination">
              <p className="content-pagination-info">
                {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredHomeworks.length)}{" "}
                of {filteredHomeworks.length}
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
          <div className="homeworks-table-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <table className="homeworks-table">
                <thead>
                  <tr>
                    <th
                      id="table-text"
                      className={popupVisible ? 'popup-visible' : ''}
                      onClick={(e) => handleFilterClick(e, "status")}
                    >
                      Status{" "}
                      {(sortedColumn === "status" && sortOrder) ||
                      (filters.status && filters.status.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? 'popup-visible' : ''}
                      onClick={(e) => handleFilterClick(e, "createdAt")}
                    >
                      Available On{" "}
                      {(sortedColumn === "createdAt" && sortOrder) ||
                      (filters.createdAt && filters.createdAt.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? 'popup-visible' : ''}
                      onClick={(e) => handleFilterClick(e, "dueOn")}
                    >
                      Due On{" "}
                      {(sortedColumn === "dueOn" && sortOrder) ||
                      (filters.dueOn && filters.dueOn.length > 0) ? (
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
                    <th
                      id="table-text"
                      className={popupVisible ? 'popup-visible' : ''}
                      onClick={(e) => handleFilterClick(e, "type")}
                    >
                      Homework Type{" "}
                      {(sortedColumn === "type" && sortOrder) ||
                      (filters.type && filters.type.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? 'popup-visible' : ''}
                      onClick={(e) => handleFilterClick(e, "completionRate")}
                    >
                      Completion Rate{" "}
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
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((homework) => (
                    <tr key={homework.id}>
                      <td>
                        <button
                          className={`status-${homework.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {homework.status}
                        </button>
                      </td>
                      <td>{formatDate(homework.createdAt)}</td>
                      <td>{formatDate(homework.dueOn)}</td>
                      <td>{homework.assignedTo}</td>
                      <td>{homework.type}</td>
                      <td>
                        <button
                          className={
                            homework.completionRate >= 0 &&
                            homework.completionRate <= 30
                              ? "rate-completion-low"
                              : homework.completionRate >= 31 &&
                                homework.completionRate <= 80
                              ? "rate-completion-middle"
                              : homework.completionRate >= 81 &&
                                homework.completionRate <= 100
                              ? "rate-completion-high"
                              : ""
                          }
                        >
                          {homework.completionRate}%
                        </button>
                      </td>
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
        />
      )}
    </div>
  );
};

export default ListOfHomeworks;
