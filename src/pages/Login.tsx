import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { Shield, User } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-placeholder">ZP</div>
          <h1>Zeppelin Pro ATS</h1>
          <p>Izaberite nalog za pristup sistemu</p>
        </div>

        <div className="login-roles">
          <button className="role-btn admin" onClick={() => handleLogin('Admin')}>
            <Shield size={24} />
            <div className="role-info">
              <strong>Administrator</strong>
              <span>Pregled svih ocena i proseka</span>
            </div>
          </button>

          <button className="role-btn evaluator" onClick={() => handleLogin('Branislav')}>
            <User size={24} />
            <div className="role-info">
              <strong>Branislav</strong>
              <span>Unos ocena i beleški</span>
            </div>
          </button>

          <button className="role-btn evaluator" onClick={() => handleLogin('Dusan')}>
            <User size={24} />
            <div className="role-info">
              <strong>Dušan</strong>
              <span>Unos ocena i beleški</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
