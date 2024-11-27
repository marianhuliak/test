import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FilterPopup from "./FilterPopup.js";

import logo from "../img/Logo.svg";
import buttonRight from "../img/list-of-homeworks-button-right.svg";
import buttonLeft from "../img/list-of-homeworks-button-left.svg";
import lockIcon from "../img/lock-icon.svg";
import filterIcon from "../img/filter-icon.svg";
import "../img/Logo.svg";
import "../styles/FilterPopup.css";
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

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const [sortOrder, setSortOrder] = useState(""); //
  const [sortedColumn, setSortedColumn] = useState(""); //

  const handleFilterClick = (e, columnName) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setPopupVisible(true);
    setSortedColumn(columnName); //
  };

  const fetchHomeworks = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/homework?homeworkIds=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22`
      );
      setHomeworks(response.data.homeworks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching homeworks:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

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
    const matchesTitle = hw.title.toLowerCase().includes(searchLower);
    const matchesDate =
      searchLower.length >= 3 &&
      (formatDate(hw.createdAt).toLowerCase().includes(searchLower) ||
        formatDate(hw.dueDate).toLowerCase().includes(searchLower));
    return matchesTitle || matchesDate;
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
                      onClick={(e) => handleFilterClick(e, "status")}
                    >
                      Status{" "}
                      {sortedColumn === "status" && sortOrder && (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      )}
                    </th>
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "createdAt")}
                    >
                      Available On{" "}
                      {sortedColumn === "createdAt" && sortOrder && (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      )}
                    </th>
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "dueDate")}
                    >
                      Due On{" "}
                      {sortedColumn === "dueDate" && sortOrder && (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      )}
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
                      onClick={(e) => handleFilterClick(e, "type")}
                    >
                      Homework Type{" "}
                      {sortedColumn === "type" && sortOrder && (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      )}
                    </th>
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "rate")}
                    >
                      Completion Rate{" "}
                      {sortedColumn === "rate" && sortOrder && (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((hw) => (
                    <tr key={hw.id}>
                      <td>
                        <button
                          className={`status-${hw.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {hw.status}
                        </button>
                      </td>

                      <td>{formatDate(hw.createdAt)}</td>
                      <td>{formatDate(hw.dueDate)}</td>
                      <td>{hw.class}</td>
                      <td>{hw.type}</td>
                      <td>
                        <button
                          className={
                            hw.rate >= 0 && hw.rate <= 30
                              ? "rate-completion-low"
                              : hw.rate >= 31 && hw.rate <= 80
                              ? "rate-completion-middle"
                              : hw.rate >= 81 && hw.rate <= 100
                              ? "rate-completion-high"
                              : ""
                          }
                        >
                          {hw.rate}%
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {popupVisible && (
              <FilterPopup
                position={popupPosition}
                onClose={() => setPopupVisible(false)}
                onSortChange={(order) => {
                  setSortOrder(order);
                  setPopupVisible(false);
                }}
                sortedColumn={sortedColumn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOfHomeworks;
