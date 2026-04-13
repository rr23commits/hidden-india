import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLocations, getStates } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import './Explore.css';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [externalResults, setExternalResults] = useState([]); // 🔥 NEW
  const [states, setStates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');

  // 🔥 Fetch from DB
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (search) params.search = search;
      if (selectedState) params.state = selectedState;

      const res = await getLocations(params);
      setLocations(res.data.locations);
      setTotal(res.data.total);

      // 🔥 If no DB results → fetch from API
      if (res.data.locations.length === 0 && search) {
        fetchExternalLocations(search);
      } else {
        setExternalResults([]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedState]);

  // 🔥 External API (OpenStreetMap)
  const fetchExternalLocations = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`
      );
      const data = await res.json();
      setExternalResults(data);
    } catch (err) {
      console.error('External search failed', err);
    }
  };

  useEffect(() => {
    getStates().then(res => setStates(res.data.states)).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchLocations, 400);
    return () => clearTimeout(timer);
  }, [fetchLocations]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedState) params.state = selectedState;
    setSearchParams(params);
  }, [search, selectedState, setSearchParams]);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStateChange = (state) => setSelectedState(state === selectedState ? '' : state);
  const clearFilters = () => {
    setSearch('');
    setSelectedState('');
    setExternalResults([]);
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <div className="container">
          <h1>Discover Hidden India</h1>
          <p>Every corner of this land holds a story untold</p>

          <div className="explore-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by destination, state, or experience..."
              value={search}
              onChange={handleSearchChange}
            />
            {(search || selectedState) && (
              <button className="clear-btn" onClick={clearFilters}>✕ Clear</button>
            )}
          </div>
        </div>
      </div>

      <div className="container explore-body">
        {/* Sidebar */}
        <aside className="explore-sidebar">
          <div className="sidebar-section">
            <h4>Filter by State</h4>
            <div className="state-filters">
              {states.map(state => (
                <button
                  key={state}
                  className={`state-btn ${selectedState === state ? 'active' : ''}`}
                  onClick={() => handleStateChange(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="explore-results">
          <div className="results-header">
            <span className="results-count">
              {loading ? 'Searching...' : `${total} destination${total !== 1 ? 's' : ''} found`}
            </span>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="card-skeleton"></div>)}
            </div>

          ) : locations.length > 0 ? (

            <div className="results-grid">
              {locations.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>

          ) : externalResults.length > 0 ? (

            // 🔥 SHOW API RESULTS
            <div className="external-results">
              <h3>Location found</h3>
              <p>This place isn’t in our curated list, but you can still explore it.</p>

              <div className="results-grid">
                {externalResults.map((place, index) => (
                  <div key={index} className="external-card">
                    <h4>{place.display_name.split(',')[0]}</h4>
                    <p>{place.display_name}</p>

                    <button
                      className="btn-outline"
                      onClick={() =>
                        window.location.href = `/nearby?lat=${place.lat}&lng=${place.lon}&name=${encodeURIComponent(place.display_name)}`
                      }
                    >
                      Explore Nearby Services
                    </button>
                  </div>
                ))}
              </div>
            </div>

          ) : (

            // 🔴 NOTHING FOUND
            <div className="no-results">
              <div style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '16px' }}>—</div>
              <h3>No destinations found</h3>
              <p>
                Try searching for Ziro, Spiti, Hampi or Majuli.
              </p>
              <button className="btn-outline" onClick={clearFilters}>
                Clear search
              </button>
            </div>

          )}
        </main>
      </div>
    </div>
  );
};

export default Explore;