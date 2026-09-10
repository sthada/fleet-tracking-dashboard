import { useState, useEffect } from "react";
import { getStatistics, getVehicles, getVehiclesByStatus } from "./api";
import { getLabelClass, dateUtil } from "./UtilsFunction";
import VehicleStatusModal from "./VehicleStatusModal";
import FleetStatistics from "./FleetStatistics";
import Header from "./Header";
import "./App.css";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [status, setStatus] = useState("Connecting...");
  const [socket, setSocket] = useState(null);
  const vehicleHeader = [
    "Vehicle",
    "Driver",
    "Status",
    "Speed",
    "Destination",
    "ETA",
    "Last Update",
    "Location",
  ];
  const triggerDataFetch = (activeSocket) => {
    if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
      console.log("Fetching fresh data via WebSocket...");

      activeSocket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const incomingArray = Array.isArray(parsed)
            ? parsed
            : parsed.data || [parsed];

          // Overwrite existing vehicles by ID instead of blindly stacking duplicates
          setVehicles((prev) => {
            const vehicleMap = new Map(prev.map((v) => [v.id, v]));
            incomingArray.forEach((v) => {
              if (v && v.id) vehicleMap.set(v.id, v);
            });
            return Array.from(vehicleMap.values());
          });
        } catch (error) {
          console.error("Error parsing triggerDataFetch payload:", error);
        }
      };

      activeSocket.send(JSON.stringify({}));
    }
  };

  useEffect(() => {
    const myWebsocket = new WebSocket("wss://case-study-26cf.onrender.com");
    let fetchTimer = null;
    // 2. Connection opened
    myWebsocket.onopen = () => {
      setStatus("Connected");
      setSocket(myWebsocket);
      fetchTimer = setInterval(() => {
        triggerDataFetch(myWebsocket);
      }, 180000);
    };


    myWebsocket.onmessage = (event) => {
      try {
        console.log("Received raw:", event.data);
        const parsed = JSON.parse(event.data);
        const incomingArray = Array.isArray(parsed)
          ? parsed
          : parsed.data || [parsed];

        // Merges stream data elegantly by replacing matching IDs
        setVehicles((prev) => {
          const vehicleMap = new Map(prev.map((v) => [v.id, v]));
          incomingArray.forEach((v) => {
            if (v && v.id) vehicleMap.set(v.id, v);
          });
          return Array.from(vehicleMap.values());
        });
      } catch (error) {
        console.error("Error parsing stream WebSocket data:", err);
      }
    };

    // 4. Handle errors
    myWebsocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setStatus("Error connecting");
    };

    // 5. Connection closed
    myWebsocket.onclose = () => {
      setStatus("Disconnected");
      setSocket(null);
    };
    fetch("https://case-study-26cf.onrender.com/api/vehicles")
      .then((response) => response.json())
      .then((data) => {
        const vehiclesData = data.data;
        console.log(vehiclesData);
        setVehicles([...vehiclesData]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch("https://case-study-26cf.onrender.com/api/statistics")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);

        setStatistics(data.data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
    return () => {
      if (myWebsocket) {
        myWebsocket.close();
      }
      if (fetchTimer) {
        clearInterval(fetchTimer);
      }
    };
  }, []);
  useEffect(() => {
    const url =
      filterStatus === "all"
        ? "https://case-study-26cf.onrender.com/api/vehicles"
        : `https://case-study-26cf.onrender.com/api/vehicles/status/${filterStatus}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setVehicles([...data.data]);
      })
      .catch((error) => {
        console.error("Error fetching vehicles by filter:", error);
      });
  }, [filterStatus]);

  return (
    <>
      <Header />
      <div className="grid-container">
        <div className="sidebar">
          <div className="heading">Filter By Status</div>

          <div className="dashboard-grid">
            <div
              className={
                filterStatus === "all" ? "metric-card active" : "metric-card"
              }
              onClick={() => setFilterStatus("all")}
            >
              <div className="metric-label">
                <div className="circular-dot"></div>
                <span>All ( {vehicles.length} )</span>
              </div>
            </div>
            <div
              className={
                filterStatus === "idle" ? "metric-card active" : "metric-card"
              }
              onClick={() => setFilterStatus("idle")}
            >
              <div className="metric-label">
                <div className="circular-dot"></div>
                <span>Idle ( {vehicles.filter((v) => v.status === "idle").length} )</span>
              </div>
            </div>
            <div
              className={
                filterStatus === "en_route"
                  ? "metric-card active"
                  : "metric-card"
              }
              onClick={() => setFilterStatus("en_route")}
            >
              <div className="metric-label">
                <div className="circular-dot cyan"></div>
                <span>En Route ( {vehicles.filter((v) => v.status === "en_route").length} )</span>
              </div>
            </div>
            <div
              className={
                filterStatus === "delivered"
                  ? "metric-card active"
                  : "metric-card"
              }
              onClick={() => setFilterStatus("delivered")}
            >
              <div className="metric-label">
                <div className="circular-dot green"></div>
                <span>Delivered ( {vehicles.filter((v) => v.status === "delivered").length} ) </span>
              </div>
            </div>
          </div>
          <FleetStatistics statistics={statistics} />
        </div>
        <div className="table-container">
          <div className="table-row-header">
            {vehicleHeader.map((key) => (
              <div>{key}</div>
            ))}
          </div>
          {vehicles.length > 0 &&
            vehicles.map((vehicle, index) => (
              <div className="table-row" key={vehicle.id}>
                <div
                  className="col-sm"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                    setSelectedVehicle(vehicle.id);
                  }}
                >
                  {vehicle.vehicleNumber}
                </div>
                <div className="col-lr">{vehicle.driverName}</div>
                <div className={getLabelClass(vehicle.status)}>
                  {vehicle.status}
                </div><div>
                <div className="col-sm gray label-pill">
                  {" "}
                  {vehicle.speed == 0
                    ? `${vehicle.speed}`
                    : `${vehicle.speed} mph`}
                </div>
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
            ))}
        </div>
        {isModalOpen && (
          <VehicleStatusModal
            props={selectedVehicle}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default App;
