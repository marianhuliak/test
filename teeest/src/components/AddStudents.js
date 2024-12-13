import React, { useState, useEffect } from "react";
import "../styles/AddStudents.css";
import logo from "../img/Logo.svg";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

import cross from "../img/cross-to-close.svg";
import buttonRight from "../img/add-studens-button-right.svg";
import lockIcon from "../img/add-lock-icon.svg";
import googlePlay from "../img/get-it-on-google-play.svg";
import appStore from "../img/download-on-the-app-store.svg";
import englishIcon from "../img/english-icon.svg";

const API_BASE_URL_STUDENTS =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/students";

const newStudents = [
  {
    id: "4VboQawarMTzaxTugyBeDV03a463",
    email: "student-1@test.com",
    first_name: "Thomas",
    last_name: "Robertson",
    role: "student",
    custom_avatar_used: true,
    avatar_url:
      "data:image/png;base64,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",
    job_title: null,
    region_id: "region-1",
    school_id: "school-1",
    grade_id: "grade-1",
  },
  {
    id: "GIgHTb78n0RjbZer3F3AfTGWRs13",
    email: "student-2@test.com",
    first_name: "Andrew",
    last_name: "Barker",
    role: "student",
    custom_avatar_used: true,
    avatar_url:
      "data:image/png;base64,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",
    job_title: null,
    region_id: "region-1",
    school_id: "school-1",
    grade_id: "grade-1",
  },
  {
    id: "JKJhFVIaoFapqiazT2N0dRaeMoR2",
    email: "student-3@test.com",
    first_name: "Josh",
    last_name: "Lane",
    role: "student",
    custom_avatar_used: true,
    avatar_url:
      "data:image/png;base64,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",
    job_title: null,
    region_id: "region-1",
    school_id: "school-1",
    grade_id: "grade-1",
  },
  {
    id: "X9mI8c5P7nUskDuwgNz1q0EzZmj1",
    email: "student-4@test.com",
    first_name: "Brandon",
    last_name: "Baxter",
    role: "student",
    custom_avatar_used: true,
    avatar_url:
      "data:image/png;base64,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",
    job_title: null,
    region_id: "region-1",
    school_id: "school-1",
    grade_id: "grade-2",
  },
  {
    id: "wpSuDqtLz4ZDIEHB0R6PwMt7x8N2",
    email: "student-5@test.com",
    first_name: "Robert",
    last_name: "Bell",
    role: "student",
    custom_avatar_used: true,
    avatar_url:
      "data:image/png;base64,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",
    job_title: null,
    region_id: "region-1",
    school_id: "school-1",
    grade_id: "grade-2",
  },
];

const AddStudents = () => {
  const [grade, setGrade] = useState("");
  const [students, setStudents] = useState([]);
  const qrValue = "https://example.com";

  const filteredStudents = grade
    ? newStudents.filter((student) => student.grade_id === grade)
    : newStudents;

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_BASE_URL_STUDENTS);
      const allStudents = response.data.students;
      const firstTwoStudents = allStudents.slice(0, 19);
      setStudents(firstTwoStudents);
      console.log(response);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const uniqueGradeIds = [
    ...new Set(students.map((student) => student.grade_id)),
  ];

  useEffect(() => {
    fetchStudents();
    console.log(filteredStudents);
  }, []);

  return (
    <div className="add-group-play-container">
      <div className="add-header-green">
        <img src={logo} alt="logo" className="add-header-logo-img" />
        <div className="add-header-logo">
          <p className="add-header-logo-text">Add students to</p>
          <img
            src={buttonRight}
            className="add-header-button-right"
            alt="Button right"
          ></img>
          <p className="add-header-logo-text">
            St George's British International School{" "}
            <img src={lockIcon} className="add-lock-icon" alt="Lock icon"></img>{" "}
          </p>
          <img
            src={buttonRight}
            className="add-header-button-right"
            alt="Button right"
          ></img>

          <div className="add-class-dropdown-container">
            <form className="add-class-label" s action="#">
              <select
                name="languages"
                id="add-lang-class"
                className="add-lang-class"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
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
        </div>
        <button className="add-header-close-button">
          <img
            src={cross}
            style={{ width: "16px", height: "16px" }}
            alt="cross"
          />
          CLOSE
        </button>
      </div>
      <div className="add-group-play-body">
        <div className="add-group-play-body-container">
          <div className="scan-to-install-container">
            <img src={englishIcon} alt="English icon" />
            <p className="scan-to-install">
              Scan to install <span className="plingo-app">Plingo app </span>{" "}
              and join the class of
              <span className="plingo-app"> Eric Todd </span>
            </p>
          </div>

          <div className="add-qrcode-container">
            <div>
              <div style={{ padding: "15px", background: "white" }}>
                <QRCodeCanvas
                  value={qrValue}
                  size={370}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  qrStyle="square"
                  renderAs="canvas"
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="download-app-container">
              <img
                className="download-app"
                src={googlePlay}
                alt="Google Play"
              />
              <img src={appStore} alt="App Store" />
            </div>
          </div>

          {newStudents && newStudents.length > 0 ? (
            <div className="container-with-added-students">
              <p className="added-students">
                Students joined: {filteredStudents.length}
              </p>
              <li className="student-card-container">
                {filteredStudents.map((student, index) => (
                  <ul key={index} className="student-card">
                    <img
                      src={student.avatar_url}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="student-avatar"
                    />
                    <p className="student-name">
                      {student.first_name} {student.last_name}
                    </p>
                  </ul>
                ))}
              </li>
            </div>
          ) : (
            <div className="add-recommended-activity-container">
              <p className="waiting-for-students-to-join">
                Waiting for students to join...
              </p>
              <div className="container-of-new-students"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudents;
