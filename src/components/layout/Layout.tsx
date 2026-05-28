import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout: React.FC = () => {
  const { currentUser } = useAuth();
  
  const getAvatarLetter = () => {
    if (!currentUser) return 'K'; // Korisnik default
    return currentUser.charAt(0);
  };
  
  const getRoleDisplay = () => {
    if (currentUser === 'Admin') return 'Administrator';
    if (currentUser === 'Branislav' || currentUser === 'Dusan') return 'Intervjuer';
    return '';
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <div className="top-header">
          <div className="user-profile">
            <div className="avatar">{getAvatarLetter()}</div>
            <div className="user-info">
              <span className="user-name">{currentUser || 'Korisnik'}</span>
              <span className="user-role">{getRoleDisplay()}</span>
            </div>
          </div>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
