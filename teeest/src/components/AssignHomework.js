import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import logo from "../img/Logo.svg";

import "../styles/AssignHomework.css";

import "../img/Logo.svg";

const API_BASE_URL =
  "http://127.0.0.1:5001/aylee-learns-english-dev/us-central1/api/api";

const AssignHomework = () => {
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
          <p className="header-logo-text">Assign homework</p>
        </div>
        <div className="header-login">log in</div>
      </div>

      <div className="content">
        <div className="container">
          <div className="content-container">
            <div className="content-top">
              <div className="content-top-search">


              
              </div>

              
            </div>

            
          </div>
         
        </div>
      </div>

    </div>
  );
};

export default AssignHomework;
