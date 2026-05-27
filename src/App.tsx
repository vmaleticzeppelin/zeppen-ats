import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Process from './pages/Process';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EvalProvider } from './context/EvaluationContext';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EvalProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="process" element={<Process />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </EvalProvider>
    </AuthProvider>
  );
};

export default App;
