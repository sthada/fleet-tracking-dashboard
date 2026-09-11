import { useState, useEffect } from "react";
import { getLabelClass, dateUtil } from "./UtilsFunction";
import VehicleStatusModal from "./VehicleStatusModal";
import TableRow from "./TableRow";
import FleetStatistics from "./FleetStatistics";
import Header from "./Header";
import "./App.css";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStatusCount, setFilterStatusCount] = useState({
    all: 0,
    idle: 0,
    en_route: 0,
    delivered: 0,
  });
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
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
  function updateFilterCount(arr) {
    // let idleTemp= ;
    // let en_route= vehicles.filter((v) => v?.status === "en_route").length;
    // let delivered=vehicles.filter((v) => v?.status === "delivered").length;

    setFilterStatusCount({
      all: arr.length,
      idle: arr.filter((v) => v?.status === "idle").length,
      en_route: arr.filter((v) => v?.status === "en_route").length,
      delivered: arr.filter((v) => v?.status === "delivered").length,
    });
  }

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
          updateFilterCount(incomingArray);
          const now = Date.now();
          setLastUpdateTime(now);
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
        updateFilterCount(incomingArray);
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
        // updateFilterCount();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch("https://case-study-26cf.onrender.com/api/statistics")
      .then((response) => response.json())
      .then((data) => {
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
        const now = Date.now();
        console.log(
          "))))))))))))))))))))))))))))))))",
          now,
          now.toLocaleTimeString(),
        );
        setLastUpdateTime(now);
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
          <div class="live-status-badge">
            <img src="green-wifi-15069.svg" />
            <span className="status-text">Live Updates Active</span>
          </div>
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
                <span>All ( {statistics?.total} )</span>
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
                <span>
                  Idle ( {filterStatusCount.idle} )
                </span>
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
                <span>
                  En Route ({" "}
                  {filterStatusCount.en_route} )
                </span>
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
                <span>
                  Delivered ({" "}
                  {filterStatusCount.delivered}{" "}
                  ){" "}
                </span>
              </div>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <FleetStatistics statistics={statistics} />
          <div className="status-bar">
            <svg
              class="status-icon"
              xmlns="http://w3.org"
              fill="none"
              viewBox="0 0 36 36"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span className="status-text-bottom">
              Updated{" "}
              {Math.floor((Date.now() - lastUpdateTime) / 1000)}s ago{" "}
              <span class="dot">•</span> Next update in ~
              {Math.floor((Date.now() - lastUpdateTime) / 60000)}{" "}
              minutes
            </span>
          </div>
        </div>
        <div className="content">
          <div className="content-header">
            <p>Vehicle ({vehicles.length})</p>
            <div className="label-pill label-green">Live</div>
          </div>
          <div className="table-container">
            <div className="table-row-header">
              {vehicleHeader.map((key) => (
                <div>{key}</div>
              ))}
            </div>
            {vehicles.length > 0 &&
              vehicles.map((vehicle, index) => (
                <TableRow
                  vehicle={vehicle}
                  setIsModalOpen={setIsModalOpen}
                  setSelectedVehicle={setSelectedVehicle}
                />
              ))}
          </div>
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
