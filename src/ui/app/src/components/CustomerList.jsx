import React, { useState } from 'react';
import './CustomerList.css';

const CustomerList = ({ customers, loading, error }) => {
  const [showDetails, setShowDetails] = useState({});

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!customers || customers.length === 0) {
    return <div className="no-results">No customers found</div>;
  }

  const toggleDetails = (customerId) => {
    setShowDetails(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  return (
    <div className="customer-list">
      <h2>Customers ({customers.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Country</th>
              <th>Registration Date</th>
              {customers[0].premium_amount && <th>Premium</th>}
              {customers[0].risk_profile && <th>Risk Profile</th>}
              {customers[0].coverage_level && <th>Coverage</th>}
              {customers[0].car_brand && <th>Car Brand</th>}
              {customers[0].similarity_score && <th>Similarity</th>}
              {customers[0].cluster_name && <th>Segment</th>}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <React.Fragment key={customer.customer_id}>
                <tr className={showDetails[customer.customer_id] ? 'expanded' : ''}>
                  <td>
                    <button
                      className="expand-btn"
                      onClick={() => toggleDetails(customer.customer_id)}
                    >
                      {showDetails[customer.customer_id] ? '▼' : '►'}
                    </button>
                  </td>
                  <td>{customer.customer_id}</td>
                  <td>{customer.age}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.country}</td>
                  <td>{customer.registration_date && new Date(customer.registration_date).toLocaleDateString()}</td>
                  {customer.premium_amount && <td>${customer.premium_amount.toFixed(2)}</td>}
                  {customer.risk_profile && <td>{customer.risk_profile}</td>}
                  {customer.coverage_level && <td>{customer.coverage_level}</td>}
                  {customer.car_brand && <td>{customer.car_brand}</td>}
                  {customer.similarity_score && (
                    <td>{(1 - customer.similarity_score).toFixed(2)}</td>
                  )}
                  {customer.cluster_name && <td>{customer.cluster_name}</td>}
                </tr>
                {showDetails[customer.customer_id] && (
                  <tr className="details-row">
                    <td colSpan="12">
                      <div className="customer-details">
                        <div className="details-section">
                          <h4>Policy Details</h4>
                          <ul>
                            {customer.policy_id && <li><strong>Policy ID:</strong> {customer.policy_id}</li>}
                            {customer.start_date && <li><strong>Start Date:</strong> {new Date(customer.start_date).toLocaleDateString()}</li>}
                            {customer.premium_amount && <li><strong>Premium:</strong> ${customer.premium_amount.toFixed(2)}</li>}
                            {customer.payment_frequency && <li><strong>Payment Frequency:</strong> {customer.payment_frequency}</li>}
                            {customer.coverage_level && <li><strong>Coverage Level:</strong> {customer.coverage_level}</li>}
                            {customer.deductible && <li><strong>Deductible:</strong> ${customer.deductible}</li>}
                            {customer.has_second_driver !== undefined && <li><strong>Second Driver:</strong> {customer.has_second_driver ? 'Yes' : 'No'}</li>}
                          </ul>
                        </div>

                        <div className="details-section">
                          <h4>Risk Factors</h4>
                          <ul>
                            {customer.risk_profile && <li><strong>Risk Profile:</strong> {customer.risk_profile}</li>}
                            {customer.num_accidents !== undefined && <li><strong>Accidents:</strong> {customer.num_accidents}</li>}
                            {customer.years_with_license !== undefined && <li><strong>Years Licensed:</strong> {customer.years_with_license}</li>}
                            {customer.has_garage !== undefined && <li><strong>Garage:</strong> {customer.has_garage ? 'Yes' : 'No'}</li>}
                          </ul>
                        </div>

                        <div className="details-section">
                          <h4>Vehicle Details</h4>
                          <ul>
                            {customer.car_brand && <li><strong>Brand:</strong> {customer.car_brand}</li>}
                            {customer.car_model && <li><strong>Model:</strong> {customer.car_model}</li>}
                            {customer.car_year !== undefined && <li><strong>Year:</strong> {customer.car_year}</li>}
                          </ul>
                        </div>

                        {customer.customer_description && (
                          <div className="details-section full-width">
                            <h4>Customer Description</h4>
                            <p className="customer-description">{customer.customer_description}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList; 