
// ● GET /api/vehicles – Fetch list of vehicles with status and details
// ● GET /api/vehicles/{id} – Fetch single vehicle detail
// ● GET /api/vehicles/status/{status} – Fetch vehicles filtered by status
// ● GET /api/statistics – Fetch overall fleet statistics

export function getStatistics() {
  return fetch('https://case-study-26cf.onrender.com/api/statistics');
}

 export function getVehicles() {
      return fetch('https://case-study-26cf.onrender.com/api/vehicles')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          return data.data;
        })
        .catch(error => {
          console.error('Error fetching vehicles:', error);
          throw error;
        });
    }

    function getVehicleById(id) {
      return fetch(`https://case-study-26cf.onrender.com/api/vehicles/${id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          return data;
        })
        .catch(error => {
          console.error(`Error fetching vehicle with ID ${id}:`, error);
          throw error;
        });
    }

export function getVehiclesByStatus(status) {
      return fetch(`https://case-study-26cf.onrender.com/api/vehicles/status/${status}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          return data;
        })
        .catch(error => {
          console.error(`Error fetching vehicles with status ${status}:`, error);
          throw error;
        });
    }