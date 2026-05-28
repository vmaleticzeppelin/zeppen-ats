import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCheck, Briefcase, FileText, User, ArrowLeft } from 'lucide-react';
import FirstRoundWizard from '../components/FirstRoundWizard';
import { useCandidates } from '../context/CandidateContext';
import { useAuth } from '../context/AuthContext';
import { useEvaluations } from '../context/EvaluationContext';
import AdminFirstRoundView from '../components/AdminFirstRoundView';
import './Process.css';

const Process: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidate } = useCandidates();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('osnovni-podaci');
  
  const candidate = id ? getCandidateById(id) : null;

  if (!candidate) {
    return (
      <div className="process-container">
        <div className="empty-tab">
          <h3>Kandidat nije pronađen</h3>
          <button className="btn-primary" onClick={() => navigate('/candidates')}>Nazad na listu</button>
        </div>
      </div>
    );
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCandidate(candidate.id, { notes: e.target.value });
  };

  return (
    <div className="process-container">
      <div className="process-header">
        <div className="header-info">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
            <button className="btn-secondary" style={{padding: '0.5rem'}} onClick={() => navigate('/candidates')}><ArrowLeft size={18}/></button>
            <h1 style={{marginBottom: 0}}>Profil Kandidata</h1>
          </div>
          <p>Kandidat: <strong>{candidate.name}</strong> • Trenutni status: {candidate.status}</p>
        </div>
      </div>

      <div className="process-tabs">
        <button className={`tab-btn ${activeTab === 'osnovni-podaci' ? 'active' : ''}`} onClick={() => setActiveTab('osnovni-podaci')}>
          Osnovni Podaci
        </button>
        {currentUser !== 'Zorica' && (
          <>
            <button className={`tab-btn ${activeTab === 'prvi-krug' ? 'active' : ''}`} onClick={() => setActiveTab('prvi-krug')}>
              1. Prvi krug (Uživo)
            </button>
            {currentUser === 'Admin' && (
              <button className={`tab-btn ${activeTab === 'admin-pregled' ? 'active' : ''}`} onClick={() => setActiveTab('admin-pregled')}>
                [ADMIN] Uporedni prikaz ocena
              </button>
            )}
            <button className={`tab-btn ${activeTab === 'drugi-krug' ? 'active' : ''}`} onClick={() => setActiveTab('drugi-krug')}>
              2. Drugi krug (Napredno)
            </button>
            <button className={`tab-btn ${activeTab === 'treci-krug' ? 'active' : ''}`} onClick={() => setActiveTab('treci-krug')}>
              3. Probni rad (3-5 dana)
            </button>
          </>
        )}
      </div>

      <div className="process-content">
        {activeTab === 'osnovni-podaci' && (
          <div className="card" style={{padding: '2rem'}}>
            <h2 style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><User size={24}/> Generalne informacije</h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <p><strong>Ime i prezime:</strong> {candidate.name}</p>
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Telefon:</strong> {candidate.phone}</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <p><strong>Datum prijave:</strong> {candidate.appliedDate}</p>
                {candidate.interviewDate && (
                  <p><strong>Zakazan razgovor:</strong> {new Date(candidate.interviewDate).toLocaleString('sr-RS', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                )}
                {candidate.cvUrl && (
                  <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <strong>CV Dokument:</strong> 
                    <button className="btn-secondary" style={{padding: '0.25rem 0.5rem'}} onClick={() => window.open(candidate.cvUrl, '_blank')}>
                      <FileText size={14} style={{marginRight: '0.25rem'}} /> Otvori CV
                    </button>
                  </p>
                )}
              </div>
            </div>

            <div className="input-group full-width">
              <label>Opšti komentar / Beleške o kandidatu (pre prve faze)</label>
              <textarea 
                rows={4} 
                placeholder="Unesite prve utiske, zapažanja iz CV-a ili beleške nakon inicijalnog poziva..."
                value={candidate.notes || ''}
                onChange={handleNotesChange}
              />
            </div>

            {currentUser !== 'Zorica' && (
              <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end'}}>
                <button className="btn-primary" onClick={() => setActiveTab('prvi-krug')}>Započni Prvi Krug</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'prvi-krug' && <FirstRoundWizard candidateId={candidate.id} />}
        
        {activeTab === 'admin-pregled' && currentUser === 'Admin' && (
          <div className="card" style={{padding: '2rem'}}>
            <AdminFirstRoundViewWrapper candidateId={candidate.id} />
          </div>
        )}

        {activeTab === 'drugi-krug' && (
          <div className="evaluation-form empty-tab">
            <UserCheck size={48} className="empty-icon" />
            <h3>Drugi krug - U pripremi</h3>
            <p>Sadržaj drugog kruga.</p>
          </div>
        )}

        {activeTab === 'treci-krug' && (
          <div className="evaluation-form empty-tab">
            <Briefcase size={48} className="empty-icon" />
            <h3>Probni rad - U pripremi</h3>
            <p>Sadržaj trećeg kruga.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper komponenta za ucitavanje podataka za Admin pregled
const AdminFirstRoundViewWrapper = ({ candidateId }: { candidateId: string | number }) => {
  const { getEvaluation } = useEvaluations();
  
  const branislav = getEvaluation(String(candidateId), 'Branislav');
  const dusan = getEvaluation(String(candidateId), 'Dusan');
  
  return <AdminFirstRoundView branislavData={branislav} dusanData={dusan} />;
};

export default Process;
