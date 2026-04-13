import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './NearbyServices.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SERVICE_TYPES = [
  { id: 'Hospital', label: 'Hospitals' },
  { id: 'Hotel', label: 'Hotels' },
  { id: 'Restaurant', label: 'Restaurants' },
  { id: 'Police', label: 'Police' },
  { id: 'Atm', label: 'ATMs' },
  { id: 'Pharmacy', label: 'Pharmacy' },
];

const NearbyServices = () => {
  const routeLocation = useLocation();

  const queryParams = new URLSearchParams(routeLocation.search);
  const urlLat = queryParams.get('lat');
  const urlLng = queryParams.get('lng');
  const urlName = queryParams.get('name');

  const passedState = routeLocation.state;

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [userLocation, setUserLocation] = useState(
    urlLat && urlLng
      ? { lat: parseFloat(urlLat), lng: parseFloat(urlLng) }
      : passedState
      ? { lat: parseFloat(passedState.lat), lng: parseFloat(passedState.lng) }
      : null
  );

  const [locationName, setLocationName] = useState(
    urlName ? decodeURIComponent(urlName) : passedState?.name || ''
  );

  const [manualInput, setManualInput] = useState('');
  const [selectedType, setSelectedType] = useState('hospital');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance.current);
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const timer = setTimeout(() => {
      mapInstance.current?.setView([userLocation.lat, userLocation.lng], 15);
      searchNearby(userLocation.lat, userLocation.lng, selectedType);
    }, 600);

    return () => clearTimeout(timer);
  }, [userLocation, selectedType]);

  const searchNearby = async (lat, lng, type) => {
    setLoading(true);
    setPlaces([]);
    setError('');

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const query = `
    [out:json][timeout:25];
    node(around:3000,${lat},${lng});
    out;
    `;

    try {
      const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
        method: 'POST',
        body: query,
      });

      const data = await res.json();

      let results = data.elements.filter(place => {
        const tag = place.tags || {};

        if (type === 'restaurant') return ['restaurant', 'cafe', 'fast_food'].includes(tag.amenity);
        if (type === 'hotel') return ['hotel', 'guest_house'].includes(tag.tourism);
        if (type === 'hospital') return tag.amenity === 'hospital';
        if (type === 'pharmacy') return tag.amenity === 'pharmacy' || tag.shop === 'chemist';
        if (type === 'atm') return tag.amenity === 'atm';
        if (type === 'police') return tag.amenity === 'police';

        return false;
      });

      results = results
        .map(place => ({
          ...place,
          distance: getDistance(lat, lng, place.lat, place.lon),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      setPlaces(results);

      results.forEach(place => {
        const marker = L.marker([place.lat, place.lon])
          .addTo(mapInstance.current)
          .bindPopup(`<strong>${place.tags?.name || 'Place'}</strong><br/>${place.distance} km away`);

        markersRef.current.push(marker);
      });

      L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: '#C2603A',
        color: 'white',
        weight: 2,
        fillOpacity: 1,
      }).addTo(mapInstance.current);

    } catch (err) {
      console.error(err);
      setError('Too many requests. Please wait a few seconds.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setSearching(true);
    setError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualInput)}&format=json&limit=1`
      );

      const data = await res.json();
      if (data.length === 0) {
        setError('Location not found');
        return;
      }

      const { lat, lon, display_name } = data[0];

      setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setLocationName(display_name.split(',')[0]);

    } finally {
      setSearching(false);
    }
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setLocationName('Your Location');
    });
  };

  const openDirections = (place) => {
    window.open(
      `https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${place.lat},${place.lon}`,
      '_blank'
    );
  };

  return (
    <div className="nearby-page">
      <div className="nearby-header">
        <div className="container">
          <h1>Nearby Services</h1>

          <form className="manual-search-form" onSubmit={handleManualSearch}>
            <input
              type="text"
              placeholder="Enter a location"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
            />
            <button type="submit">{searching ? 'Searching...' : 'Search'}</button>
          </form>

          <div className="location-bar">
            <span>{locationName || 'No location selected'}</span>
            <button className="detect-btn" onClick={detectLocation}>
              Detect My Location
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>
      </div>

      <div className="nearby-body">
        <div className="service-filters">
          {SERVICE_TYPES.map(type => (
            <button
              key={type.id}
              className={`service-filter-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="nearby-content">
          <div className="map-container">
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>

          <div className="results-panel">
            <h3>{selectedType}</h3>

            {loading ? (
              <p>Loading...</p>
            ) : places.length === 0 ? (
              <p>No results found</p>
            ) : (
              <div className="places-list">
  {places.map((place, i) => (
    <div key={i} className="place-card">
      
      {/* 🔥 rank circle */}
      <div className="place-rank">{i + 1}</div>

      <div className="place-info">
        <h4>{place.tags?.name || 'Unnamed Place'}</h4>

        {/* 🔥 distance */}
        <div className="place-address">
          {place.distance} km away
        </div>

        {/* optional address */}
        {place.tags?.['addr:street'] && (
          <div className="place-address">
            {place.tags['addr:street']}
          </div>
        )}
      </div>

      {/* 🔥 styled button */}
      <button
        className="directions-btn"
        onClick={() => openDirections(place)}
      >
        Directions
      </button>
    </div>
  ))}
</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyServices;