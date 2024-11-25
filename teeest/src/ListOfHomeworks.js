import React, { useState, useEffect } from "react";
import axios from "axios";

import logo from "./img/Logo.svg";
import buttonRight from "./img/list-of-homeworks-button-right.svg";
import buttonLeft from "./img/list-of-homeworks-button-left.svg";
import "./ListOfHomeworks.css";

const API_BASE_URL =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api";

const ListOfHomeworks = () => {
  const [homeworks, setHomeworks] = useState([]); // Список домашніх завдань
  const [searchTerm, setSearchTerm] = useState(""); // Поле для пошуку
  const [loading, setLoading] = useState(true); // Індикатор завантаження
  const [error, setError] = useState(null); // Для помилок

  // Завантаження даних
  const fetchHomeworks = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/homework?homeworkIds=1,2`
      );
      console.log(response.data); // Вивести отримані дані
      setHomeworks(response.data.homeworks); // Зберігаємо дані у стан
      setLoading(false); // Завантаження завершено
    } catch (error) {
      console.error("Error fetching homeworks:", error);
      setError("Failed to load data."); // Встановлюємо помилку
      setLoading(false); // Завантаження завершено, навіть якщо сталася помилка
    }
  };

  useEffect(() => {
    fetchHomeworks(); // Завантаження даних під час першого рендеру
  }, []);

  const filteredHomeworks = homeworks.filter((hw) =>
    hw.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  onChange={(e) => setSearchTerm(e.target.value)} // Додано для пошуку
                  placeholder="Search by title..."
                  className="content-top-search-input"
                />
              </div>
              <div className="content-top-button">
                <button className="content-top-add-button">ADD HOMEWORK</button>
              </div>
            </div>

            <div className="content-pagination">
              <p className="content-pagination-info">1-10 of 28</p>
              <img
                src={buttonLeft}
                alt="buttonLeft"
                className="content-pagination-button"
              />
              <img
                src={buttonRight}
                alt="buttonRight"
                className="content-pagination-button"
              />
            </div>
          </div>

          <div className="homeworks-table-container">
            {/* {loading ? ( // Показ індикатора завантаження
            <p>Loading...</p>
          ) : error ? ( // Відображення помилки
            <p className="error">{error}</p>
          ) : (*/}
          

            <table className="homeworks-table">
              <thead>
                <tr>
                  <th className="table-text">Status</th>
                  <th className="table-text">Avaible on:</th>
                  <th className="table-text">Due on:</th>
                  <th className="table-text">Class 🔒</th>
                  <th className="table-text">Homework type</th>
                  <th className="table-text">Complation Rate</th>
                </tr>
              </thead>
              <div className="homeworks-table-line"/>
             
              <tbody>
                
                {filteredHomeworks.map((hw) => (
                    
                  <tr key={hw.id}>
                    
                    <td>{hw.id}</td>
                    <td>{hw.createdAt}</td>
                    <td>{hw.dueDate}</td>
                    <td>{hw.subject}</td>
                    
                  </tr>
                  
                ))}
                
              </tbody>
            </table>
            {/*   )}    */}
          </div>

        </div>

      </div>



    </div>
  );
};

export default ListOfHomeworks;
