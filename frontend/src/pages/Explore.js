import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLocations, getStates } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import './Explore.css';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [states, setStates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (search) params.search = search;
      if (selectedState) params.state = selectedState;
      const res = await getLocations(params);
      setLocations(res.data.locations);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedState]);

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
  const clearFilters = () => { setSearch(''); setSelectedState(''); };

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
        {/* Sidebar Filters */}
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
            {(search || selectedState) && (
              <div className="active-filters">
                {search && <span className="filter-tag">Search: "{search}" ✕</span>}
                {selectedState && <span className="filter-tag">{selectedState} ✕</span>}
              </div>
            )}
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
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🗺️</div>
              <h3>No destinations found</h3>
              <p>Try different search terms or clear your filters</p>
              <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Explore;
