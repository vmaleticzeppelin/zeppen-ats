import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BarChart2, 
  Settings, 
  HelpCircle,
  LogOut,
  User,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-text">
            <span className="brand-name">Zeppelin Pro</span>
            <span className="app-name">ATS System</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-group">
          <div className="nav-group-title">EDUKACIJA</div>
          <NavLink to="/onboarding" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <HelpCircle className="nav-icon" size={20} />
            <span>Edu modul</span>
          </NavLink>
        </div>

        <div className="nav-group">
          <div className="nav-group-title">GLAVNI MODULI</div>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/calendar" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <CalendarDays className="nav-icon" size={20} />
            <span>Kalendar</span>
          </NavLink>
          
          {currentUser !== 'Zorica' && (
            <NavLink to="/process" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <UserCheck className="nav-icon" size={20} />
              <span>Prvi krug</span>
            </NavLink>
          )}

          <NavLink to="/candidates" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Users className="nav-icon" size={20} />
            <span>Kandidati</span>
          </NavLink>
          
          {currentUser !== 'Zorica' && (
            <NavLink to="/compare" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <BarChart2 className="nav-icon" size={20} />
              <span>Poređenje</span>
            </NavLink>
          )}
        </div>
        
        <div className="nav-group">
          <div className="nav-group-title">SISTEM</div>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Settings className="nav-icon" size={20} />
            <span>Podešavanja</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <strong>{currentUser}</strong>
            <span>{currentUser === 'Admin' ? 'Administrator' : currentUser === 'Zorica' ? 'HR / Unos' : 'Intervjuer'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Odjavi se" style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto'}}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
