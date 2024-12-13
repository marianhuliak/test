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
  const [isLoading, setIsLoading] = useState(false); // Статус завантаження
  const [error, setError] = useState(null); // Для обробки помилок

  const fetchCreateRoom = async () => {
    setIsLoading(true); // Почати завантаження
    setError(null); // Очистити помилки перед запитом

    try {
      const response = await axios.post(API_BASE_URL_CREATE_ROOM, {
        hostId: 3,
        gameName: "TestOne",
      });

      console.log("Full response:", response);

      if (response?.data?.roomCode) {
        setRoomCode(response.data.roomCode); // Встановлюємо код кімнати
        console.log("Room code set to:", response.data.roomCode);
      } else {
        console.warn("No roomCode found in response:", response.data);
      }
    } catch (error) {
      console.error("Error during request:", error);
      setError("Failed to create room. Please try again."); // Встановлюємо помилку
    } finally {
      setIsLoading(false); // Завершуємо завантаження
    }
  };

  useEffect(() => {
    fetchCreateRoom(); // Створюємо кімнату при завантаженні компонента
  }, []);

  return (
    <div className="play-group-play-container">
      <div className="play-header-green">
        <img src={logo} alt="logo" className="play-header-logo-img" />
        <div className="play-header-logo">
          <img
            src={groupIcon}
            style={{ width: "40px", height: "40px" }}
            alt="Icon user group"
          />
          <p className="play-header-logo-text">Group play setup</p>
        </div>
        <button className="play-header-close-button">
          <img
            src={cross}
            style={{ width: "16px", height: "16px" }}
            alt="cross"
          />
          CLOSE
        </button>
      </div>

      <div className="play-group-play-body-container">
        <div className="play-qrcode-container">
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

        <div className="play-recommended-activity-container">
          <div className="play-recommended-activity">
            <p className="play-recommended-activity-text">Recommended activity</p>
            <div className="play-start-container">
              <button className="play-start-button" disabled={isLoading}>
                {isLoading ? "Creating Room..." : "Start"}
              </button>
            </div>
          </div>

          <div>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Виводимо помилку, якщо є */}
            {roomCode ? (
              <p style={{ color: "white" }}>Students joined: {roomCode}</p>
            ) : (
              <p style={{ color: "white" }}>Waiting for room code...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPlay;




/*import React, { useState, useEffect } from "react";
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

  
  
  
  
  

  

  useEffect(() => {
    fetchCreateRoom();
    
  }, []);
  

  return (
    <div className="play-group-play-container">
      <div className="play-header-green">
        <img src={logo} alt="logo" className="play-header-logo-img" />
        <div className="play-header-logo">
          <img
            src={groupIcon}
            style={{ width: "40px", height: "40px" }}
            alt="Icon user group"
          ></img>
          <p className="play-header-logo-text">Group play setup</p>
        </div>
        <button className="play-header-close-button">
          <img
            src={cross}
            style={{ width: "16px", height: "16px" }}
            alt="cross"
          />
          CLOSE
        </button>
      </div>

      <div className="play-group-play-body-container">
        <div className="play-qrcode-container">
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

        <div className="play-recommended-activity-container">
          <div className="play-recommended-activity">
            <p className="play-recommended-activity-text">Recommended activity</p>
            <div className="play-start-container">
              <button className="play-start-button">Start</button>
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
*/