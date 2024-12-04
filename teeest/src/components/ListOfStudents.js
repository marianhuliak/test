import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FilterPopup from "./FilterPopup.js";

import logo from "../img/Logo.svg";
import buttonRight from "../img/lists-button-right.svg";
import buttonLeft from "../img/lists-button-left.svg";
import qrcodeIcon from "../img/qrcode-icon-add-students.svg";
import lockIcon from "../img/lock-icon.svg";
import filterIcon from "../img/filter-icon.svg";
import "../styles/ListOfStudents.css";

const API_BASE_URL =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/students?studentId=1";

const ListOfStudents = () => {
  const [students, setHomeworks] = useState([]);
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

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setHomeworks(response.data.students);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState({
    first_name: [],
    general_trend: [],
    weekly_timespent: [],
    weekly_performance: [],
    homework_completion: [],
    strongest_skills: [],
    weakest_skills: [],
    weekly_timespent: [],
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
    const filterableColumns = [
      "first_name",
      "general_trend",
      "weekly_timespent",
      "weekly_performance",
      "homework_completions",
      "strongest_skills",
      "weakest_skills",
    ];
    if (filterableColumns.includes(columnName)) {
      setUniqueStatuses(uniqueColumnValues(students, columnName));
    } else {
      setUniqueStatuses([]);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesName =
      student.first_name.toLowerCase().includes(searchLower) ||
      student.last_name.toLowerCase().includes(searchLower);

    const matchesFilter =
      filters.first_name.length === 0 ||
      filters.first_name.includes(student.first_name);

    return matchesName && matchesFilter;
  });

  const sortHomeworks = (students) => {
    if (sortedColumn && sortOrder) {
      return [...students].sort((a, b) => {
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
    return students;
  };

  const sortedHomeworks = sortHomeworks(filteredStudents);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedHomeworks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < filteredStudents.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchStudents();
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
    <div className="list-of-students">
      <div className="header">
        <div className="header-logo">
          <img src={logo} alt="logo" className="header-logo-img" />
          <p className="header-logo-text">Students</p>
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
                  placeholder="Search by name..."
                  className="content-top-search-input"
                />
              </div>
              <div className="content-top-button">
                <button className="content-top-add-button">
                  <img
                    src={qrcodeIcon}
                    alt="qrcode-icon"
                    className="qrcode-icon-add-students"
                  />
                  ADD STUDENT
                </button>
              </div>
            </div>

            <div className="content-pagination">
              <p className="content-pagination-info">
                {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredStudents.length)}{" "}
                of {filteredStudents.length}
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
          <div className="students-table-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th
                      id="table-text"
                      onClick={(e) => handleFilterClick(e, "first_name")}
                    >
                      Name{" "}
                      {(sortedColumn === "first_name" && sortOrder) ||
                      (filters.first_name && filters.first_name.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th id="table-text">
                      School{" "}
                      <img
                        src={lockIcon}
                        className={"lock-icon"}
                        alt="lockIcon"
                      />
                    </th>
                    <th id="table-text">
                      Teacher{" "}
                      <img
                        src={lockIcon}
                        className={"lock-icon"}
                        alt="lockIcon"
                      />
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
                      className={popupVisible ? "popup-visible" : ""}
                      onClick={(e) => handleFilterClick(e, "general_trend")}
                    >
                      General Trend{" "}
                      {(sortedColumn === "general_trend" && sortOrder) ||
                      (filters.general_trend &&
                        filters.general_trend.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? "popup-visible" : ""}
                      onClick={(e) => handleFilterClick(e, "weekly_timespent")}
                    >
                      Time spent
                      <br />
                      This Week{" "}
                      {(sortedColumn === "weekly_timespent" && sortOrder) ||
                      (filters.weekly_timespent &&
                        filters.weekly_timespent.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? "popup-visible" : ""}
                      onClick={(e) => handleFilterClick(e, "weekly_timespent")}
                    >
                      Performance
                      <br />
                      This Week{" "}
                      {(sortedColumn === "weekly_timespent" && sortOrder) ||
                      (filters.weekly_timespent &&
                        filters.weekly_timespent.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? "popup-visible" : ""}
                      onClick={(e) =>
                        handleFilterClick(e, "homework_completion")
                      }
                    >
                      Student
                      <br />
                      Completion{" "}
                      {(sortedColumn === "homework_completion" && sortOrder) ||
                      (filters.homework_completion &&
                        filters.homework_completion.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? "popup-visible" : ""}
                      onClick={(e) => handleFilterClick(e, "strongest_skills")}
                    >
                      Strongest Skills{" "}
                      {(sortedColumn === "strongest_skills" && sortOrder) ||
                      (filters.strongest_skills &&
                        filters.strongest_skills.length > 0) ? (
                        <img
                          src={filterIcon}
                          alt="Filter Icon"
                          className={"filter-icon"}
                        />
                      ) : null}
                    </th>
                    <th
                      id="table-text"
                      className={popupVisible ? "popup-visible" : ""}
                      onClick={(e) => handleFilterClick(e, "weakest_skills")}
                    >
                      Weakest Skills{" "}
                      {(sortedColumn === "weakest_skills" && sortOrder) ||
                      (filters.weakest_skills &&
                        filters.weakest_skills.length > 0) ? (
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
                  {currentItems.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name">
                          <img src={student.avatar_url} />
                          {student.first_name} {student.last_name}
                        </div>
                      </td>

                      <td>{student.school_id}</td>

                      <td>Eric Todd</td>

                      <td>{student.grade_id}</td>

                      <td>
                        {" "}
                        <button
                          className={
                            {
                              "falling behind": "rate-completion-low",
                              "catching up": "rate-completion-middle",
                              "on track": "rate-completion-high",
                            }[
                              student.general_trend
                                ? student.general_trend.toLowerCase()
                                : ""
                            ] || "n-a"
                          }
                        >
                          {student.general_trend
                            ? student.general_trend
                            : (student.general_trend = "N/A")}
                        </button>
                      </td>

                      <td>
                        {" "}
                        <button
                          className={
                            student.weekly_timespent >= 0 &&
                            student.weekly_timespent <= 5
                              ? "rate-completion-low"
                              : student.weekly_timespent >= 6 &&
                                student.weekly_timespent <= 10
                              ? "rate-completion-middle"
                              : student.weekly_timespent >= 11 &&
                                student.weekly_timespent <= 168
                              ? "rate-completion-high"
                              : "n-a"
                          }
                        >
                          {typeof student.weekly_timespent === "number" &&
                          !isNaN(student.weekly_timespent)
                            ? `${student.weekly_timespent} hrs`
                            : (student.weekly_timespent = "N/A")}
                        </button>
                      </td>

                      <td>
                        <button
                          className={
                            student.weekly_performance >= 0 &&
                            student.weekly_performance <= 30
                              ? "rate-completion-low"
                              : student.weekly_performance >= 31 &&
                                student.weekly_performance <= 80
                              ? "rate-completion-middle"
                              : student.weekly_performance >= 81 &&
                                student.weekly_performance <= 100
                              ? "rate-completion-high"
                              : "n-a"
                          }
                        >
                          {typeof student.weekly_performance === "number" &&
                          !isNaN(student.weekly_performance)
                            ? `${student.weekly_performance}%`
                            : (student.weekly_performance = "N/A")}
                        </button>
                      </td>

                      <td>
                        <button
                          className={
                            student.homework_completion >= 0 &&
                            student.homework_completion <= 30
                              ? "rate-completion-low"
                              : student.homework_completion >= 31 &&
                                student.homework_completion <= 80
                              ? "rate-completion-middle"
                              : student.homework_completion >= 81 &&
                                student.homework_completion <= 100
                              ? "rate-completion-high"
                              : "n-a"
                          }
                        >
                          {typeof student.homework_completion === "number" &&
                          !isNaN(student.homework_completion)
                            ? `${student.homework_completion}%`
                            : (student.homework_completion = "N/A")}
                        </button>
                      </td>

                      <td>
                        {Array.isArray(student.strongest_skills)
                          ? student.strongest_skills.join(", ")
                          : (student.strongest_skills = "N/A")}
                      </td>

                      <td>
                        {Array.isArray(student.weakest_skills)
                          ? student.weakest_skills.join(", ")
                          : (student.weakest_skills = "N/A")}
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

export default ListOfStudents;
