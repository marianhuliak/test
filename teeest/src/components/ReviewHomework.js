import React, { useState, useEffect } from "react";
import axios from "axios";

//import DonutChart from "./Donut";
import logo from "../img/lists-button-left.svg";
import "../styles/ReviewHomework.css";

const API_BASE_URL_STUDENTS =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/students";

const API_BASE_URL_ACTIVITIES =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/activity?activityId=all";

const API_URL_ASSIGN =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/homework/assign";

const ReviewHomework = () => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [grade, setGrade] = useState("");
  const [activeButton, setActiveButton] = useState("Personalized");
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

  const mockExpectedTime = 90;
  const mockAverageCorrectAnswer = 165;

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

  return (
    <div className="new-list-of-students">
      <div className="new-header">
        <div className="new-header-logo">
          <img src={logo} alt="logo" className="new-header-logo-img" />
          <h1 className="new-header-logo-text">Review homework</h1>
        </div>
        <div className="new-header-login">log in</div>
      </div>

      <div className="new-content">
        <div className="new-container">
          <div className="new-content-top">
            <div className="chart-container">
              <p>Overall progress:</p>
              {/*<DonutChart dataValues={[17, 2, 3]} labels={["Completed", "In Progress", "Not Started"]} />*/}
              </div>
          </div>

          <div className="new-content-container-student">
            <div className="new-content-container-student-type">
              <p className="new-students-title">Students</p>
            </div>
            <table className="new-students-table">
              <thead>
                <tr>
                  <th id="new-table-text">Name</th>
                  <th id="new-table-text">Progress</th>
                  <th id="new-table-text">Succccess Rate</th>
                  <th id="new-table-text"> Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className={
                      activeButton === "Personalised" &&
                      selectedStudents.includes(student.id)
                        ? "new-selected-row"
                        : ""
                    }
                    onClick={() =>
                      activeButton === "Personalised" &&
                      toggleStudentSelection(student.id)
                    }
                  >
                    <td>
                      <div className="new-student-name">
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
                            ? "new-rate-completion-low-min"
                            : mockAverageCorrectAnswer >= 46 &&
                              mockAverageCorrectAnswer <= 70
                            ? "new-rate-completion-middle"
                            : mockAverageCorrectAnswer >= 1 &&
                              mockAverageCorrectAnswer <= 45
                            ? "new-rate-completion-high"
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
                            ? "new-rate-completion-low"
                            : mockExpectedTime >= 31 && mockExpectedTime <= 80
                            ? "new-rate-completion-middle"
                            : mockExpectedTime >= 81 && mockExpectedTime <= 100
                            ? "new-rate-completion-high"
                            : ""
                        }
                      >
                        {mockExpectedTime}%
                      </button>
                    </td>

                    <td className="new-main-text new-weakest-skills-lock-container">
                      {Array.isArray(student?.weakest_skills) &&
                      student.weakest_skills.length > 0
                        ? capitalizeFirstWord(student.weakest_skills.join(", "))
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="new-content-container-activity">
            <div className="new-content-container-activity-recommended">
              <p className="new-students-title">
                {activeButton === "Same For All"
                  ? "Results For"
                  : selectedStudents.length === 1
                  ? `Results For ${
                      students.find(
                        (student) => student.id === selectedStudents[0]
                      )?.first_name || "Selected Student"
                    }`
                  : "Recommended Activities"}
              </p>

              <div className="new-give-grade-container">
                <div className="new-class-dropdown-container">
                  <form className="new-class-label" s action="#">
                    <label className="new-students-title" htmlFor="lang-class">
                      Grade:
                    </label>
                    <select
                      name="languages"
                      id="new-lang-class"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="C-">C-</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </form>
                </div>
                <button className="new-personalised-button">
                  ADD FEEDBACK
                </button>
              </div>
            </div>
            <div>
              <table className="new-students-table">
                <thead>
                  <tr>
                    <th id="new-table-text">Activity</th>
                    <th id="new-table-text">Task ID</th>
                    <th id="new-table-text">Answer Correctness</th>
                    <th id="new-table-text">Answer speed</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="new-main-text">
                        {activity.languageElements}
                      </td>

                      <td className="new-main-text">11</td>
                      <td className="new-main-text">
                        {activity.primarySkills.join(", ")}
                      </td>

                      <td className="new-main-text">
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
  );
};

export default ReviewHomework;
