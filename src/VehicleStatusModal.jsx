import React from "react";
import "./VehicleStatusModal.css";

export default function VehicleStatusModal({ props, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <h2>🚚 {props.vehicleNumber}</h2>
            <p className="header-subtitle">{props.driverName} • {props.status}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* {JSON.stringify(props)} */}

          <div className="info-card">
            <div className="card-label">🧭 Status</div>
            <div className="status-pill">✅ {props.status}</div>
          </div>

          <div className="info-card">
            <div className="card-label">⏱️ Current Speed</div>
            <div className="card-value">{props.currentSpeed} mph</div>
          </div>

          <div className="info-card">
            <div className="card-label">👤 Driver</div>
            <div className="card-value">{props.driverName}</div>
          </div>

          <div className="info-card">
            <div className="card-label">📞 Phone</div>
            <div className="card-value">{props.driverPhone}</div>
          </div>

          <div className="info-card">
            <div className="card-label">📍 Destination</div>
            <div className="card-value">{props.destination}</div>
          </div>

          <div className="info-card">
            <div className="card-label">🧭 Location</div>
            <div
              className="card-value"
              style={{fontSize: '13px', fontFamily: 'monospace'}}
            >
              <p>{props.currentLocation.lat}, </p>
              <p> {props.currentLocation.lng}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="card-label">🔋 Battery Level</div>
            <div className="card-value">{props.batteryLevel}%</div>
            <div className="progress-container">
              <div className="progress-bar danger" style={{width: `${props.batteryLevel}%`}}></div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-label">⛽ Fuel Level</div>
            <div className="card-value">{props.fuelLevel}%</div>
            <div className="progress-container">
              <div className="progress-bar warning" style={{width: `${props.fuelLevel}%`}}></div>
            </div>
          </div>

          <div className="info-card full-width">
            <div className="card-label">🕒 Last Updated</div>
            <div className="card-value">{props.lastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
