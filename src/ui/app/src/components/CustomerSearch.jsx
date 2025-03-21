import React, { useState } from 'react';
import './CustomerSearch.css';

const CustomerSearch = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 3) {
      onSearch(query, topK);
    }
  };

  return (
    <div className="customer-search">
      <h2>Customer Semantic Search</h2>
      <p className="search-description">
        Describe the customers you're looking for in natural language (e.g., "young drivers with high risk")
      </p>
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the customers you want to find..."
            className="search-input"
            minLength={3}
            required
          />
          <div className="search-limit">
            <label htmlFor="topk">Results: </label>
            <select
              id="topk"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="search-button" disabled={loading || query.trim().length < 3}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerSearch; 