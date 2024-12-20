import React, { useState, useEffect } from "react";
import axios from "axios";

import logo from "../img/Logo.svg";
import lockIcon from "../img/lock-icon.svg";

import "../styles/AssignHomework.css";

const API_BASE_URL_STUDENTS =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/students";

const API_BASE_URL_ACTIVITIES =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/activity?activityId=all";

const API_URL_ASSIGN =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/homework/feedback/:1";

const AssignHomework = () => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [activeButton, setActiveButton] = useState("Same For All");
  const [dueOn, setDueOn] = useState("");
  const [avaibleOn, setAvaibleOn] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    if (buttonType !== "Personalised") {
      setSelectedStudents([]);
    }
  };

  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([studentId]);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      dueOn,
      avaibleOn,
      assignedTo,
      activeButton,
      selectedStudents,
      activities: ["activity09"],
    };

    localStorage.setItem("homeworkDraft", JSON.stringify(draftData));
    alert("Draft saved successfully!");
  };

  const handlePublish = async () => {
    const body = {
      dueOn,
      createdBy: 150,
      assignedTo,
      homeworkType:
        activeButton === "Same For All" ? "Same For All" : "Personalized",
      activities: ["activity09"],
    };

    try {
      const response = await axios.post(API_URL_ASSIGN, body);
      alert("Homework assigned successfully!");
    } catch (error) {
      console.error("Error assigning homework:", error);
      alert("Failed to assign homework. Please try again.");
    }
  };

  const mockExpectedTime = 90;
  const mockAverageCorrectAnswer = 165;

  const uniqueGradeIds = [
    ...new Set(students.map((student) => student.grade_id)),
  ];

  function capitalizeFirstWord(text) {
    if (!text) return "";
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words;
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_BASE_URL_STUDENTS);
      const allStudents = response.data.students;
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

  useEffect(() => {
    fetchStudents();
    fetchActivities();
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem("homeworkDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);

      setDueOn(parsedDraft.dueOn ? parsedDraft.dueOn.slice(0, 16) : "");
      setAvaibleOn(
        parsedDraft.avaibleOn ? parsedDraft.avaibleOn.slice(0, 16) : ""
      );

      setAssignedTo(parsedDraft.assignedTo || "");
      setActiveButton(parsedDraft.activeButton || "Same For All");
      setSelectedStudents(parsedDraft.selectedStudents || []);
    }
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem("homeworkDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
  
      setDueOn(parsedDraft.dueOn || "");
      setAvaibleOn(parsedDraft.avaibleOn || "");
    }
  }, []);
  

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
                <label className="class-label-title" htmlFor="lang-class">
                  Class:
                </label>
                <select
                  name="languages"
                  id="lang-class"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select a class</option>
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
                <input
                  type="datetime-local"
                  id="lang-available"
                  onChange={(e) => setAvaibleOn(e.target.value)}
                />
              </form>
            </div>

            <div className="class-dropdown-container">
              <form className="class-label">
                <label className="class-label-title" htmlFor="lang-available">
                  Due on:
                </label>
                <input
                  type="datetime-local"
                  id="lang-available"
                  onChange={(e) => setDueOn(e.target.value)}
                />
              </form>
            </div>
            <div className="buttons-container">
              <button className="save-draft-button" onClick={handleSaveDraft}>
                SAVE DRAFT
              </button>

              <button className="publish-button" onClick={handlePublish}>
                PUBLISH
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="content-container">
              <div className="content-container-student">
                <div className="content-container-student-type">
                  <p className="class-label-title">Homework Type:</p>
                  <div className="content-container-student-type-button">
                    <button
                      className={`same-for-all-button ${
                        activeButton === "Same For All" ? "active" : ""
                      }`}
                      onClick={() => handleButtonClick("Same For All")}
                    >
                      Same for all
                    </button>

                    <button
                      className={`personalised-button ${
                        activeButton === "Personalised" ? "active" : ""
                      }`}
                      onClick={() => handleButtonClick("Personalised")}
                    >
                      Personalised
                    </button>
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
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className={
                          activeButton === "Personalised" &&
                          selectedStudents.includes(student.id)
                            ? "selected-row"
                            : ""
                        }
                        onClick={() =>
                          activeButton === "Personalised" &&
                          toggleStudentSelection(student.id)
                        }
                      >
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
                                : mockExpectedTime >= 31 &&
                                  mockExpectedTime <= 80
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
                          {Array.isArray(student?.weakest_skills) &&
                          student.weakest_skills.length > 0
                            ? capitalizeFirstWord(
                                student.weakest_skills.join(", ")
                              )
                            : "N/A"}

                          {activeButton === "Same For All" ? (
                            <img
                              src={lockIcon}
                              className={"lock-icon"}
                              alt="lockIcon"
                            />
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="content-container-activity">
                <div className="content-container-activity-recommended">
                  <p className="class-label-title">
                    {activeButton === "Same For All"
                      ? "Recommended Activities For All Students"
                      : selectedStudents.length === 1
                      ? `Recommended Activities For ${
                          students.find(
                            (student) => student.id === selectedStudents[0]
                          )?.first_name || "Selected Student"
                        }`
                      : "Recommended Activities"}
                  </p>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignHomework;
