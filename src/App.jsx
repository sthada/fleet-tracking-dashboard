import { useState, useEffect } from "react";
import { getStatistics, getVehicles, getVehiclesByStatus } from "./api";
import {getLabelClass, dateUtil, triggerDataFetch} from './UtilsFunction'
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
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    idle: 0,
    "en_route": 0,
    delivered: 0,
  });
  const [status, setStatus] = useState('Connecting...');
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

  useEffect(() => {
    const myWebsocket = new WebSocket('wss://case-study-26cf.onrender.com');
    let fetchTimer = null;
        // 2. Connection opened
    myWebsocket.onopen = () => {
      setStatus('Connected');
      setSocket(myWebsocket);
      fetchTimer = setInterval(() => {
        triggerDataFetch(myWebsocket);
      }, 180000); 
    };

    // 3. Listen for incoming messages
    myWebsocket.onmessage = (event) => {
      console.log('Received:', event.data);
        setVehicles((prev) => [...prev, 
      JSON.parse(event.data)]);
  
    };

    // 4. Handle errors
    myWebsocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setStatus('Error connecting');
    };

    // 5. Connection closed
    myWebsocket.onclose = () => {
      setStatus('Disconnected');
      setSocket(null);
    };
    fetch("https://case-study-26cf.onrender.com/api/vehicles")
      .then((response) => response.json())
      .then((data) => {
        const vehiclesData = data.data;
        console.log(vehiclesData);
        setVehicles([...vehiclesData]);
        let statusCountTotal={
          all: vehiclesData.length,
          idle: vehiclesData.filter((v) => v.status === "idle").length,
          "en_route": vehiclesData.filter((v) => v.status === "en_route").length,
          delivered: vehiclesData.filter((v) => v.status === "delivered").length,
        };
        console.log("Status Counts:", statusCountTotal);
        setStatusCounts({...statusCountTotal
        });
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
          clearTimeout(fetchTimer);
        }
      }
  }, []);
  useEffect(() => {
    const url = filterStatus === "all" ? "https://case-study-26cf.onrender.com/api/vehicles" : `https://case-study-26cf.onrender.com/api/vehicles/status/${filterStatus}`;
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
    <><Header />
      <div className="grid-container">
        <div className="sidebar">
          <div className="heading">Filter By Status</div>

          <div className="dashboard-grid">

            <div className={filterStatus === "all" ? "metric-card active" : "metric-card"} onClick={() => setFilterStatus("all")}>
              <div className="metric-label">
                <div className="circular-dot"></div>
                <span>All ( {statusCounts.all} )</span>
              </div>
            </div>
            <div className={filterStatus === "idle" ? "metric-card active" : "metric-card"} onClick={() => setFilterStatus("idle")}>
              <div className="metric-label">
                <div className="circular-dot"></div>
                <span>Idle ( {statusCounts.idle} )</span>
              </div>
            </div>
            <div className={filterStatus === "en_route" ? "metric-card active" : "metric-card"} onClick={() => setFilterStatus("en_route")}>
              <div className="metric-label">
                <div className="circular-dot cyan"></div>
                <span>En Route ( {statusCounts["en_route"]} )</span>
              </div>
            </div>
            <div className={filterStatus === "delivered" ? "metric-card active" : "metric-card"} onClick={() => setFilterStatus("delivered")}>
              <div className="metric-label">
                <div className="circular-dot green"></div>
                <span>Delivered ( {statusCounts.delivered} ) </span>
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
                    setSelectedVehicle(vehicle);
                  }}
                >
                  {vehicle.vehicleNumber}
                </div>
                <div className="col-lr">{vehicle.driverName}</div>
                <div className={getLabelClass(vehicle.status)}>{vehicle.status}</div>
                <div className="col-sm"> {vehicle.speed==0 ? `${vehicle.speed}` :`${vehicle.speed} mph`}</div>
                <div className="col-lr">{vehicle.destination}</div>
                <div className="col-m">{dateUtil(vehicle.estimatedArrival).toLocaleDateString()}, {dateUtil(vehicle.estimatedArrival).toLocaleTimeString()}</div>
                <div>{dateUtil(vehicle.lastUpdated).toLocaleDateString()}, {dateUtil(vehicle.lastUpdated).toLocaleTimeString()}</div>
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
