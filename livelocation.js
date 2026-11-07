export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(   
    (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationData = { latitude, longitude };
        // Send the location data to the server via WebSocket
        socket.emit("locationUpdate", locationData);
      } 
    )}}



