import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import logo from "../img/Logo.svg";
import lockIcon from "../img/lock-icon.svg";

import "../styles/AssignHomework.css";

const API_BASE_URL_STUDENTS =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/students";

const API_BASE_URL_ACTIVITIES =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/activity?activityId=all";

const AssignHomework = () => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");

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

  const mockExpectedTime = 90;
  const mockAverageCorrectAnswer = 165;

  function uniqueColumnValues(data, column) {
    return [...new Set(data.map((item) => item[column]))];
  }

  const uniqueGradeIds = [
    ...new Set(students.map((student) => student.grade_id)),
  ];

  function capitalizeFirstWord(text) {
    if (!text) return "";
    const words = text.split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    return words.join(" ");
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
      setUniqueStatuses(uniqueColumnValues(students, columnName));
    } else {
      setUniqueStatuses([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_BASE_URL_STUDENTS);
      const allStudents = response.data.students;
      console.log(allStudents);
      const firstTwoStudents = allStudents.slice(0, 19);
      setStudents(firstTwoStudents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(API_BASE_URL_ACTIVITIES);
      setActivities(response.data.activities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
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

  const filteredStudents = students.filter((student) => {
    if (selectedGrade === "") return true; // Якщо grade не вибрано, показуємо всіх
    return student.grade_id === selectedGrade;
  });

  const handleGradeChange = (e) => {
    setSelectedGrade(e.target.value); // Оновлюємо selectedGrade
  };

  //     const searchLower = searchTerm.toLowerCase();

  //     const matchesPrimarySkills = activ.primarySkills.some((skill) =>
  //       skill.toLowerCase().includes(searchLower)
  //     );

  //     const matchesFilters = (columnName, selectedValues) => {
  //       if (selectedValues.length > 0) {
  //         return selectedValues.some((filterValue) => {
  //           const columnValue = activ[columnName];

  //           if (typeof columnValue === "number") {
  //             return columnValue === filterValue;
  //           }

  //           if (typeof columnValue === "string") {
  //             return columnValue
  //               .toLowerCase()
  //               .includes(filterValue.toLowerCase());
  //           }
  //           return false;
  //         });
  //       }
  //       return true;
  //     };

  //     const matchesLanguageElements = matchesFilters(
  //       "languageElements",
  //       filters.languageElements
  //     );
  //     const matchesPrimarySkillsFilter = matchesFilters(
  //       "primarySkills",
  //       filters.primarySkills
  //     );
  //     const matchesRequiredTime = matchesFilters(
  //       "requiredTime",
  //       filters.requiredTime
  //     );

  //     return (
  //       matchesPrimarySkills &&
  //       matchesLanguageElements &&
  //       matchesPrimarySkillsFilter &&
  //       matchesRequiredTime
  //     );
  //   });

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

  useEffect(() => {
    fetchStudents();
    fetchActivities();
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
          <p className="header-logo-text">Assign homework</p>
        </div>
        <div className="header-login">log in</div>
      </div>

      <div className="content">
        <div className="container">
          <div className="content-top">
            <div className="class-dropdown-container">
              <form className="class-label" s action="#">
                <label className="class-label-title" for="lang">
                  Class:
                </label>
                <select
                  name="languages"
                  id="lang-class"
                  value={selectedGrade}
                  onChange={handleGradeChange}
                >
                  <option value="">All</option> {/* Для вибору всіх класів */}
                  {uniqueGradeIds.map((gradeId) => (
                    <option key={gradeId} value={gradeId}>
                      {gradeId}
                    </option>
                  ))}
                </select>
              </form>
            </div>

            <div className="class-dropdown-container">
              <form className="class-label" s action="#">
                <label className="class-label-title" for="lang">
                  Available on:
                </label>
                <input type="datetime-local" id="lang-available" />
              </form>
            </div>

            <div className="class-dropdown-container">
              <form className="class-label" s action="#">
                <label className="class-label-title" for="lang">
                  Due on:
                </label>
                <input type="datetime-local" id="lang-available" />
              </form>
            </div>
            <div className="buttons-container">
              <button className="save-draft-button">SAVE DRAFT</button>
              <button className="publish-button">PUBLISH</button>
            </div>
          </div>

          <div className="content-container">
            <div className="content-container-student">
              <div className="content-container-student-type">
                <p className="class-label-title">Homework Type:</p>
                <div className="content-container-student-type-button">
                  <button className="same-for-all-button">Same for all</button>
                  <button className="personalised-button">Personalised</button>
                </div>
              </div>
              <table className="students-table">
                <thead>
                  <tr>
                    <th id="table-text">Student</th>
                    <th id="table-text">Expected Time To Complete</th>
                    <th id="table-text">
                      Average Correct <br /> Answer Probability
                    </th>
                    <th id="table-text"> Weakest skills</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name">
                          <img src={student.avatar_url} />
                          {student.first_name} {student.last_name}
                        </div>
                      </td>

                      <td>
                        {" "}
                        <button
                          className={
                            mockAverageCorrectAnswer >= 71 &&
                            mockAverageCorrectAnswer <= Infinity
                              ? "rate-completion-low-min"
                              : mockAverageCorrectAnswer >= 46 &&
                                mockAverageCorrectAnswer <= 70
                              ? "rate-completion-middle"
                              : mockAverageCorrectAnswer >= 1 &&
                                mockAverageCorrectAnswer <= 45
                              ? "rate-completion-high"
                              : "n-a"
                          }
                        >
                          {mockAverageCorrectAnswer} min
                        </button>
                      </td>

                      <td>
                        {" "}
                        <button
                          className={
                            mockExpectedTime >= 0 && mockExpectedTime <= 30
                              ? "rate-completion-low"
                              : mockExpectedTime >= 31 && mockExpectedTime <= 80
                              ? "rate-completion-middle"
                              : mockExpectedTime >= 81 &&
                                mockExpectedTime <= 100
                              ? "rate-completion-high"
                              : ""
                          }
                        >
                          {mockExpectedTime}%
                        </button>
                      </td>

                      <td className="main-text weakest-skills-lock-container">
                        {capitalizeFirstWord(student.weakest_skills.join(", "))}
                        <img
                          src={lockIcon}
                          className={"lock-icon"}
                          alt="lockIcon"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="content-container-activity">
              <div className="content-container-activity-recommended">
                <p className="class-label-title">
                  Recommended Activities For All Students
                </p>{" "}
                <button className="personalised-button">EDIT</button>
              </div>
              <div>
                <table className="students-table">
                  <thead>
                    <tr>
                      <th id="table-text">Activity</th>
                      <th id="table-text">Primary Skills</th>
                      <th id="table-text">Time required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="main-text">
                          {activity.languageElements}
                        </td>

                        <td className="main-text">
                          {activity.primarySkills.join(", ")}
                        </td>

                        <td className="main-text">
                          {activity.requiredTime} Min
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignHomework;
