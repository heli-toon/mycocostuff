import L from 'leaflet'

const lat = 37.7749
const lng = -122.4194

const map = L.map('map').setView([lat, lng], 15)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}', {attribution : '&copy; OpenStreetMap contributors'}).addTo(map);
L.marker([lat, lng]).addTo(map)