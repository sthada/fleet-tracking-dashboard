import React from "react";
import { useEffect, useState } from "react";
import { dateUtil, getProgressClass, getLabelClass } from "./UtilsFunction";
import { getVehicleById } from "./api";
import "./VehicleStatusModal.css";

export default function VehicleStatusModal({ props, onClose }) {
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(props);
    fetch(`https://case-study-26cf.onrender.com/api/vehicles/${props}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
    setVehicle({ ...data?.data });
    
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
        
        setLoading(false)
      })
    return () => {
      setVehicle({});
    };
  }, [props]);
  return (
    <div className="modal-overlay">
  {loading ? <p>Loading...</p>:
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <h2>🚚 {vehicle.vehicleNumber}</h2>
            <p className="header-subtitle">
              {vehicle.driverName} • {vehicle.status}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        {vehicle &&
        <div className="modal-body">
          {/* {JSON.stringify(props)} */}

          <div className="info-card">
            <div className="card-label">🧭 Status</div>
            <div className={getLabelClass(vehicle.status)}>
              {vehicle.status}
            </div>
          </div>

          <div className="info-card">
            <div className="card-label">⏱️ Current Speed</div>
            <div className="card-value">{vehicle.speed} mph</div>
          </div>

          <div className="info-card">
            <div className="card-label">👤 Driver</div>
            <div className="card-value">{vehicle.driverName}</div>
          </div>

          <div className="info-card">
            <div className="card-label">📞 Phone</div>
            <div className="card-value">{vehicle.driverPhone}</div>
          </div>

          <div className="info-card">
            <div className="card-label">📍 Destination</div>
            <div className="card-value">{vehicle.destination}</div>
          </div>

          <div className="info-card">
            <div className="card-label">🧭 Location</div>
            <div
              className="card-value"
              style={{ fontSize: "13px", fontFamily: "monospace" }}
            >
              <p>{vehicle.currentLocation.lat}, </p>
              <p> {vehicle.currentLocation.lng}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="card-label">🔋 Battery Level</div>
            <div className="card-value">{vehicle.batteryLevel}%</div>
            <div className="progress-container">
              <div
                className={getProgressClass(vehicle.batteryLevel)}
                style={{ width: `${vehicle.batteryLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-label">⛽ Fuel Level</div>
            <div className="card-value">{vehicle.fuelLevel}%</div>
            <div className="progress-container">
              <div
                className={getProgressClass(vehicle.fuelLevel)}
                style={{ width: `${vehicle.fuelLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="info-card full-width">
            <div className="card-label">🕒 Last Updated</div>
            <div className="card-value">
              {dateUtil(vehicle.lastUpdated).toLocaleDateString()},{" "}
              {dateUtil(vehicle.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>}
      </div>}
    </div>
  );
}
