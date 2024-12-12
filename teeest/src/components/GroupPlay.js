import React, { useState, useEffect } from "react";
import "../styles/GroupPlay.css";
import logo from "../img/Logo.svg";
import axios from "axios";

import cross from "../img/cross-to-close.svg";
import groupIcon from "../img/icon-user-group.svg";

const API_BASE_URL_CREATE_ROOM =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/room/create";

const API_BASE_URL_JOIN_ROOM =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/room/join/:id";

const GroupPlay = () => {
  const [roomCode, setRoomCode] = useState(null);

  const fetchCreateRoom = async () => {
    try {
      const response = await axios.post(API_BASE_URL_CREATE_ROOM, {
        hostId: 3,
        gameName: "TestOne",
      });
  
      console.log("Full response:", response);
  
      if (response?.data?.roomCode) {
        setRoomCode(response.data.roomCode);
        console.log("Room code set to:", response.data.roomCode);
      } else {
        console.warn("No roomCode found in response:", response.data);
      }
    } catch (error) {
      console.error("Error during request:", error);
    }
  };

  const testApi = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api/room/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hostId: 3,
            gameName: "TestOne",
          }),
        }
      );
  
      if (!response.ok) {
        console.error("Server error:", response.status, response.statusText);
        return;
      }
  
      const data = await response.json();
      console.log("Response data:", data);
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  
  
  
  
  

  

  useEffect(() => {
    fetchCreateRoom();
    
  }, []);
  

  return (
    <div className="group-play-container">
      <div className="header">
        <img src={logo} alt="logo" className="header-logo-img" />
        <div className="header-logo">
          <img
            src={groupIcon}
            style={{ width: "40px", height: "40px" }}
            alt="Icon user group"
          ></img>
          <p className="header-logo-text">Group play setup</p>
        </div>
        <button className="header-close-button">
          <img
            src={cross}
            style={{ width: "16px", height: "16px" }}
            alt="cross"
          />
          CLOSE
        </button>
      </div>

      <div className="group-play-body-container">
        <div className="qrcode-container">
          <p>Scan to join</p>
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M400 0H0V400H400V0Z" fill="white" />
          </svg>
        </div>

        <div className="recommended-activity-container">
          <div className="recommended-activity">
            <p className="recommended-activity-text">Recommended activity</p>
            <div className="start-container">
              <button className="start-button">Start</button>
            </div>
          </div>

          <div>
            <p style={{ color: "white" }}>Students joined: {roomCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPlay;
