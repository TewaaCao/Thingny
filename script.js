// script.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const datetime = document.getElementById('datetime');
const coords = document.getElementById('coords');
const photoLocation = document.getElementById('location');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
        alert("Error accessing the camera. Please check if the camera is connected and the browser has permission to access it.");
    });

// Capture the photo
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get current date and time
    const now = new Date();
    const dateTimeString = now.toLocaleString();
    
    // Get coordinates
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const coordsString = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;
        
        // Get location
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
                const locationString = data.display_name;

                // Draw metadata on the image
                context.font = '20px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'right';
                context.fillText(dateTimeString, canvas.width - 10, 30);
                context.fillText(coordsString, canvas.width - 10, 60);
                context.fillText(locationString, canvas.width - 10, 90);

                // Create a download link
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'photo_with_metadata.png';
                link.click();
            })
            .catch(err => {
                console.error("Error fetching location data: ", err);
                context.fillText('Location: Unable to fetch', canvas.width - 10, 90);

                // Create a download link
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'photo_with_metadata.png';
                link.click();
            });
    }, err => {
        console.error("Error getting coordinates: ", err);
        context.fillText('Coordinates: Unable to fetch', canvas.width - 10, 60);

        // Create a download link
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'photo_with_metadata.png';
        link.click();
    });
});
