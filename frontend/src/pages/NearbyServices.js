import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './NearbyServices.css';

const SERVICE_TYPES = [
  { id: 'hospital', label: 'Hospitals', icon: '+', color: '#ef4444', query: 'hospital' },
  { id: 'lodging', label: 'Hotels', icon: 'H', color: '#8b5cf6', query: 'hotel' },
  { id: 'restaurant', label: 'Restaurants', icon: 'R', color: '#f59e0b', query: 'restaurant' },
  { id: 'police', label: 'Police', icon: 'P', color: '#3b82f6', query: 'police station' },
  { id: 'atm', label: 'ATMs', icon: '$', color: '#10b981', query: 'ATM' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'Rx', color: '#06b6d4', query: 'pharmacy' }
];

const NearbyServices = () => {
  const routeLocation = useLocation();
  const passedState = routeLocation.state;
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [userLocation, setUserLocation] = useState(
    passedState ? { lat: parseFloat(passedState.lat), lng: parseFloat(passedState.lng) } : null
  );
  const [locationName, setLocationName] = useState(passedState?.name || '');
  const [selectedType, setSelectedType] = useState('hospital');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState('');

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Load Google Maps script
  useEffect(() => {
    if (window.google) { setMapLoaded(true); return; }
    if (!apiKey) { setError('Google Maps API key not configured.'); return; }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps.');
    document.head.appendChild(script);
  }, [apiKey]);

  const initMap = useCallback((center) => {
    if (!mapRef.current || !window.google) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#fdf6ec' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5e8d0' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] }
      ]
    });
  }, []);

  const searchNearby = useCallback((lat, lng, type) => {
    if (!mapInstance.current || !window.google) return;
    
    setLoading(true);
    setPlaces([]);
    
    // Clear markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const service = new window.google.maps.places.PlacesService(mapInstance.current);
    const serviceConfig = SERVICE_TYPES.find(s => s.id === type);
    
    service.nearbySearch({
      location: { lat, lng },
      radius: 5000,
      keyword: serviceConfig.query
    }, (results, status) => {
      setLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results.slice(0, 10));
        
        // Add markers
        results.slice(0, 10).forEach((place, i) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance.current,
            title: place.name,
            label: { text: serviceConfig.icon, fontSize: '20px' },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: serviceConfig.color,
              fillOpacity: 0.9,
              strokeColor: 'white',
              strokeWeight: 2,
              scale: 12
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="font-family:DM Sans,sans-serif;padding:4px"><strong>${place.name}</strong><br/><small>${place.vicinity || ''}</small></div>`
          });

          marker.addListener('click', () => infoWindow.open(mapInstance.current, marker));
          markersRef.current.push(marker);
        });
      } else {
        setPlaces([]);
      }
    });
  }, []);

  useEffect(() => {
    if (mapLoaded && userLocation) {
      initMap(userLocation);
      setTimeout(() => searchNearby(userLocation.lat, userLocation.lng, selectedType), 500);
    }
  }, [mapLoaded, userLocation, initMap, searchNearby, selectedType]);

  const detectLocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationName('Your Current Location');
        if (mapInstance.current) {
          mapInstance.current.setCenter(loc);
          searchNearby(loc.lat, loc.lng, selectedType);
        }
      },
      () => setError('Location access denied. Please enable location services.')
    );
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (userLocation) {
      searchNearby(userLocation.lat, userLocation.lng, type);
    }
  };

  const openDirections = (place) => {
    if (!userLocation) return;
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${place.geometry.location.lat()},${place.geometry.location.lng()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="nearby-page">
      <div className="nearby-header">
        <div className="container">
          <h1>Nearby Services</h1>
          <p>Find hospitals, hotels, restaurants and emergency services near you</p>
          <div className="location-bar">
            <div className="current-location">
              <span className="location-dot">—</span>
              <span>{locationName || 'No location selected'}</span>
            </div>
            <button className="detect-btn" onClick={detectLocation}>
              Detect My Location
            </button>
          </div>
          {error && <div className="error-banner">{error}</div>}
        </div>
      </div>

      <div className="nearby-body">
        {/* Service Type Filters */}
        <div className="service-filters">
          {SERVICE_TYPES.map(type => (
            <button
              key={type.id}
              className={`service-filter-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => handleTypeChange(type.id)}
              style={{ '--color': type.color }}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        <div className="nearby-content">
          {/* Map */}
          <div className="map-container">
            {!userLocation && (
              <div className="map-placeholder">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '16px', opacity: 0.3 }}>Map</div>
                  <h3>Select a Location</h3>
                  <p>Click "Detect My Location" or visit a destination page to see nearby services</p>
                  <button className="detect-btn" style={{ marginTop: '20px' }} onClick={detectLocation}>
                    Detect My Location
                  </button>
                  {!apiKey && (
                    <p style={{ marginTop: '16px', color: 'var(--text-light)', fontSize: '0.8rem' }}>
                      Note: Add REACT_APP_GOOGLE_MAPS_API_KEY to enable maps
                    </p>
                  )}
                </div>
              </div>
            )}
            <div ref={mapRef} className="google-map" style={{ display: userLocation ? 'block' : 'none' }}></div>
          </div>

          {/* Results */}
          <div className="results-panel">
            <div className="results-panel-header">
              <h3>
                {SERVICE_TYPES.find(s => s.id === selectedType)?.icon}
                {' '}{SERVICE_TYPES.find(s => s.id === selectedType)?.label}
              </h3>
              <span className="places-count">{loading ? '...' : `${places.length} found`}</span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '12px', color: 'var(--text-mid)', fontSize: '0.85rem' }}>Searching nearby...</p>
              </div>
            ) : !userLocation ? (
              <div className="no-location-msg">
                <p>Select a location to see nearby services</p>
              </div>
            ) : places.length === 0 ? (
              <div className="no-places">
                <p>No {SERVICE_TYPES.find(s => s.id === selectedType)?.label.toLowerCase()} found within 5km</p>
              </div>
            ) : (
              <div className="places-list">
                {places.map((place, i) => (
                  <div key={i} className="place-card">
                    <div className="place-rank">{i + 1}</div>
                    <div className="place-info">
                      <h4>{place.name}</h4>
                      <p className="place-address">{place.vicinity}</p>
                      {place.rating && (
                        <div className="place-rating">
                          ⭐ {place.rating} ({place.user_ratings_total} reviews)
                        </div>
                      )}
                      {place.opening_hours && (
                        <span className={`place-status ${place.opening_hours.open_now ? 'open' : 'closed'}`}>
                          {place.opening_hours.open_now ? '● Open Now' : '● Closed'}
                        </span>
                      )}
                    </div>
                    <button className="directions-btn" onClick={() => openDirections(place)}>
                      Directions →
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
