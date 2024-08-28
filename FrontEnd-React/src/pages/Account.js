import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Account = ({ onLogout, onSearchChange, onSearchFocus }) => {
  return (
    <div className="account-page">
      <Sidebar activeTab="/account" />
      <div className="main-content">
        <Header onLogout={onLogout} onSearchChange={onSearchChange} onSearchFocus={onSearchFocus} />
        <div className="account-content">
          <h2>Account Settings</h2>
          
        </div>
      </div>
    </div>
  );
};

export default Account;