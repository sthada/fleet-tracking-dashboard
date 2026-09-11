import React from "react";
import { getLabelClass, dateUtil } from "./UtilsFunction";

export default function TableRow({vehicle ,setIsModalOpen, setSelectedVehicle}) {
  return (
    <div className="table-row" key={vehicle.id}>
      <div
        className="col-sm"
        onClick={() => {
          setIsModalOpen(true);
          setSelectedVehicle(vehicle.id);
        }}
      >
        {vehicle.vehicleNumber}
      </div>
      <div className="col-lr">{vehicle.driverName}</div>
      <div className={getLabelClass(vehicle.status)}>{vehicle.status}</div>
      <div>
        <div className="col-sm gray label-pill">{vehicle.speed} mph</div>
      </div>
      <div className="col-lr">{vehicle.destination}</div>
      <div className="col-m">
        {dateUtil(vehicle.estimatedArrival).toLocaleDateString()},{" "}
        {dateUtil(vehicle.estimatedArrival).toLocaleTimeString()}
      </div>
      <div>
        {dateUtil(vehicle.lastUpdated).toLocaleDateString()},{" "}
        {dateUtil(vehicle.lastUpdated).toLocaleTimeString()}
      </div>
      <div className="col-lr">
        {vehicle.currentLocation?.lat?.toFixed(5)} ,{" "}
        {vehicle.currentLocation?.lng?.toFixed(5)}
      </div>
    </div>
  );
}
