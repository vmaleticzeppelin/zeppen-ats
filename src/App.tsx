import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Calendar from './pages/Calendar';
import Process from './pages/Process';
import Login from './pages/Login';
import PrintableFirstRound from './pages/PrintableFirstRound';
import PrintableCandidateReport from './pages/PrintableCandidateReport';
import PrintableSecondRound from './pages/PrintableSecondRound';
import PrintableSecondRoundReport from './pages/PrintableSecondRoundReport';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EvalProvider } from './context/EvaluationContext';
import { CandidateProvider } from './context/CandidateContext';

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
        <CandidateProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/print/first-round" element={
                <ProtectedRoute>
                  <PrintableFirstRound />
                </ProtectedRoute>
              } />
              
              <Route path="/print/report/:id" element={
                <ProtectedRoute>
                  <PrintableCandidateReport />
                </ProtectedRoute>
              } />

              <Route path="/print/second-round" element={
                <ProtectedRoute>
                  <PrintableSecondRound />
                </ProtectedRoute>
              } />

              <Route path="/print/report-r2/:id" element={
                <ProtectedRoute>
                  <PrintableSecondRoundReport />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="process/:id" element={<Process />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Router>
        </CandidateProvider>
      </EvalProvider>
    </AuthProvider>
  );
};

export default App;
