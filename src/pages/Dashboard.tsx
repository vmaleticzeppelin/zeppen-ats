import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, Target, Briefcase, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { statsData, pipelineData, topCandidates, scoreRadarData } from '../data/mockData';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Pregled sistema (Dashboard)</h1>
        <button className="btn-primary" onClick={() => navigate('/candidates')}>
          Idi na kandidate i dodaj
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.activeCandidates}</span>
            <span className="stat-label">Aktivnih kandidata</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.finalRound}</span>
            <span className="stat-label">U finalnom krugu</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.trial}</span>
            <span className="stat-label">Na probnom radu</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <UserX size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.rejected}</span>
            <span className="stat-label">Odbijeno (poslednjih 30 dana)</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-charts">
          <div className="card chart-card">
            <h3>Pipeline Selekcije</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#383D47" />
                  <XAxis dataKey="name" stroke="#A0A5B1" />
                  <YAxis stroke="#A0A5B1" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#24272D', borderColor: '#383D47', color: '#fff' }} 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <h3>Prosečan Profil Zaposlenog (Target vs Realnost)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoreRadarData}>
                  <PolarGrid stroke="#383D47" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A5B1', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A0A5B1' }} />
                  <Radar name="Prosek" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="side-panels">
          <div className="card list-card">
            <div className="card-header">
              <h3>Top Kandidati</h3>
              <button className="btn-text">Vidi sve</button>
            </div>
            <div className="candidate-list">
              {topCandidates.map(c => (
                <div key={c.id} className="candidate-item">
                  <div className="c-info">
                    <span className="c-name">{c.name}</span>
                    <span className="c-phase">{c.phase}</span>
                  </div>
                  <div className="c-score">
                    <span className="score-badge">{c.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
