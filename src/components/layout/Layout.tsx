import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <div className="top-header">
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin Korisnik</span>
              <span className="user-role">Administrator</span>
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
