import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, Target, Briefcase, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { scoreRadarData } from '../data/mockData';
import { useCandidates } from '../context/CandidateContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { candidates } = useCandidates();
  const { currentUser } = useAuth();
  
  const [passwordRequests, setPasswordRequests] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (currentUser === 'Admin') {
      const fetchRequests = async () => {
        try {
          const q = query(collection(db, 'password_reset_requests'), where('status', '==', 'pending'));
          const querySnapshot = await getDocs(q);
          const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPasswordRequests(reqs);
        } catch (error) {
          console.error('Greška pri učitavanju zahteva za šifru:', error);
        }
      };
      fetchRequests();
    }
  }, [currentUser]);

  const handleApproveRequest = async (id: string, email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      const requestRef = doc(db, 'password_reset_requests', id);
      await updateDoc(requestRef, { status: 'approved' });
      setPasswordRequests(prev => prev.filter(req => req.id !== id));
      alert(`Odobreno! Email za promenu šifre je poslat na ${email}.`);
    } catch (error: any) {
      alert('Greška prilikom odobravanja: ' + error.message);
    }
  };

  const stats = useMemo(() => {
    const active = candidates.filter(c => c.status !== 'Odbijen' && c.status !== 'Zaposlen').length;
    const finalRound = candidates.filter(c => c.status === 'Finalni krug').length;
    const trial = candidates.filter(c => c.status === 'Probni rad').length;
    const rejected = candidates.filter(c => c.status === 'Odbijen').length;

    const pipelineCounts = {
      'Neocenjen': 0,
      'Prvi krug': 0,
      'Drugi krug': 0,
      'Finalni krug': 0,
      'Ponuda': 0
    };

    candidates.forEach(c => {
      if (c.status === 'Neocenjen') {
        pipelineCounts['Neocenjen']++;
      } else if (c.status.includes('Prvi krug')) {
        pipelineCounts['Prvi krug']++;
      } else if (c.status.includes('Drugi krug')) {
        pipelineCounts['Drugi krug']++;
      } else if (c.status.includes('Finalni krug')) {
        pipelineCounts['Finalni krug']++;
      } else if (c.status === 'Ponuda') {
        pipelineCounts['Ponuda']++;
      }
    });

    const pipelineData = Object.keys(pipelineCounts).map(key => ({
      name: key,
      value: pipelineCounts[key as keyof typeof pipelineCounts]
    }));

    const top = [...candidates]
      .filter(c => c.score !== null && c.status === 'Drugi krug')
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);

    return { active, finalRound, trial, rejected, pipelineData, top };
  }, [candidates]);

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
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Aktivnih kandidata</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.finalRound}</span>
            <span className="stat-label">U finalnom krugu</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.trial}</span>
            <span className="stat-label">Na probnom radu</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <UserX size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.rejected}</span>
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
                <BarChart data={stats.pipelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
          {currentUser === 'Admin' && passwordRequests.length > 0 && (
            <div className="card list-card" style={{ marginBottom: '1.5rem', borderColor: '#3B82F6' }}>
              <div className="card-header">
                <h3>Zahtevi za šifru</h3>
                <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px' }}>{passwordRequests.length} na čekanju</span>
              </div>
              <div className="candidate-list">
                {passwordRequests.map(req => (
                  <div key={req.id} className="candidate-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="c-info">
                      <span className="c-name" style={{ fontSize: '0.9rem' }}>{req.email}</span>
                      <span className="c-phase" style={{ fontSize: '0.8rem' }}>Zatraženo: {new Date(req.requestedAt).toLocaleDateString('sr-RS')}</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleApproveRequest(req.id, req.email)}
                        className="btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Odobri
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card list-card">
            <div className="card-header">
              <h3>Top Kandidati u Drugom Krugu</h3>
              <button className="btn-text" onClick={() => navigate('/candidates')}>Vidi sve</button>
            </div>
            <div className="candidate-list">
              {stats.top.length > 0 ? stats.top.map(c => (
                <div key={c.id} className="candidate-item">
                  <div className="c-info">
                    <span className="c-name">{c.name}</span>
                    <span className="c-phase">{c.status}</span>
                  </div>
                  <div className="c-score">
                    <span className="score-badge">{c.score}%</span>
                  </div>
                </div>
              )) : (
                <div style={{ color: '#A0A5B1', padding: '1rem', textAlign: 'center' }}>
                  Trenutno nema kandidata u drugom krugu.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
