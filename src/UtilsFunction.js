export function getLabelClass(status) {
    switch (status) {
      case "en_route":
        return "col-sm cyan label-pill";
      case "delivered":
        return "col-sm green label-pill";
      default:
        return "col-sm gray label-pill";
    }
  }

  export function dateUtil (dateString){

  return new Date(dateString);
  }

  
export const triggerDataFetch = (activeSocket) => {
    
      if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
        console.log('Fetching fresh data via WebSocket...');
        activeSocket.onmessage = (event) => {
          setVehicles((prev) => [...prev, 
        JSON.parse(event.data)]);
    
      };
        
        // Customize this payload string/object to match what your backend expects
        // const requestPayload = JSON.stringify({ action: 'fetchData' }); 
        activeSocket.send(JSON.stringify({}));
      }
    };