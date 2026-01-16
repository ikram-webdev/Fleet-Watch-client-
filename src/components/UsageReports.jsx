import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { FaFileDownload, FaSearch, FaHistory } from "react-icons/fa";

const UsageReports = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/vehicles/reports/usage-history");
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch error", err);
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.vehicleId?.plateNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.driverId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4 pb-5">
      <div className="reports-container p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-white">
            <FaHistory className="me-2 text-info" /> Usage Logs
          </h3>
          <button className="btn btn-info btn-sm px-4 rounded-pill fw-bold">
            <FaFileDownload className="me-2" /> Export CSV
          </button>
        </div>

        <div className="position-relative mb-4">
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50" />
          <input
            type="text"
            className="form-control bg-dark border-secondary text-white ps-5 py-2 search-glow rounded-pill"
            placeholder="Search by Vehicle or Driver..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table custom-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Started</th>
                <th>Ended</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((trip) => (
                <tr key={trip._id}>
                  <td>
                    <div className="fw-bold text-info">
                      {trip.vehicleId?.plateNumber}
                    </div>
                    <small className="text-white-50">
                      {trip.vehicleId?.model}
                    </small>
                  </td>
                  <td>{trip.driverId?.name}</td>
                  <td>
                    {new Date(trip.startTime).toLocaleString("en-GB", {
                      hour12: true,
                    })}
                  </td>
                  <td>
                    {trip.endTime
                      ? new Date(trip.endTime).toLocaleString("en-GB", {
                          hour12: true,
                        })
                      : "---"}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        trip.status === "Completed"
                          ? "status-completed"
                          : "status-active"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsageReports;
