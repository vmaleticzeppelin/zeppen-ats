import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, FileText, Phone, Trash2, PlayCircle, Edit } from 'lucide-react';
import AddCandidateModal from '../components/AddCandidateModal';
import { useAuth } from '../context/AuthContext';
import { useCandidates } from '../context/CandidateContext';
import { useEvaluations } from '../context/EvaluationContext';
import './Candidates.css';

const getStatusBadgeClass = (status: string) => {
  if (status === 'Neocenjen') return 'badge-new';
  if (status === 'Zaposlen' || status === 'Probni rad') return 'badge-hired';
  if (status.includes('Odbijen')) return 'badge-rejected';
  return 'badge-active';
};

const Candidates: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Svi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const { candidates, addCandidate, updateCandidate, deleteCandidate } = useCandidates();
  const { evaluations } = useEvaluations();

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Svi' || c.status.includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleAddOrEditCandidate = (candidateData: any) => {
    if (editingCandidate) {
      updateCandidate(candidateData.id, candidateData);
    } else {
      addCandidate(candidateData);
    }
  };

  return (
    <div className="candidates-container">
      <AddCandidateModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingCandidate(null); }} 
        onSave={handleAddOrEditCandidate} 
        initialData={editingCandidate}
      />
      
      <div className="page-header">
        <div className="header-info">
          <h1>Baza Kandidata</h1>
          <p>Pregled svih prijava i trenutnog statusa</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Dodaj novog
        </button>
      </div>

      <div className="card table-card">
        <div className="table-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Pretraži po imenu ili emailu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} className="filter-icon" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="Svi">Svi statusi</option>
              <option value="Novi kandidat">Novi kandidat</option>
              <option value="Prvi krug">Prvi krug</option>
              <option value="Zaposlen">Zaposlen</option>
              <option value="Odbijen">Odbijen</option>
              <option value="Probni rad">Probni rad</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Ime i prezime</th>
                <th>Kontakt</th>
                <th>Status</th>
                <th>Score</th>
                <th>Datum prijave</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/process/${c.id}`)} style={{ cursor: 'pointer' }} className="clickable-row">
                  <td>
                    <div className="candidate-name-cell">
                      <div className="c-avatar">{c.name.charAt(0)}</div>
                      <span className="c-name-strong">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span className="c-email">{c.email}</span>
                      <span className="c-phone"><Phone size={12}/> {c.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                    {evaluations[String(c.id)] && Object.keys(evaluations[String(c.id)]).length > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Ocenili:
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {Object.keys(evaluations[String(c.id)]).map(evaluator => (
                            <span key={evaluator} style={{ 
                              background: 'rgba(99, 102, 241, 0.1)', 
                              color: 'var(--color-primary)', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              fontWeight: 500 
                            }}>
                              {evaluator}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    {c.score ? (
                      <span className="score-text">
                        {c.score}%
                      </span>
                    ) : (
                      <span className="score-pending">-</span>
                    )}
                  </td>
                  <td>
                    <div className="source-cell">
                      <span>{c.appliedDate}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn" title="Započni Selekciju" onClick={(e) => { e.stopPropagation(); navigate(`/process/${c.id}`); }}>
                        <PlayCircle size={18} style={{color: 'var(--color-primary)'}} />
                      </button>
                      <button className="action-btn" title="Pogledaj CV" onClick={(e) => {
                        e.stopPropagation();
                        const candidateAny = c as any;
                        if (candidateAny.cvUrl) {
                          window.open(candidateAny.cvUrl, '_blank');
                        } else {
                          alert('Ovaj kandidat nema postavljen CV.');
                        }
                      }}>
                        <FileText size={18} />
                      </button>
                      
                      {(() => {
                        const isFinishedFirstRound = c.status !== 'Neocenjen' && c.status !== 'Novi kandidat' && c.status !== 'Zakazan prvi razgovor';
                        const canModify = currentUser === 'Admin' || (currentUser !== 'Zorica' && !isFinishedFirstRound);
                        return canModify ? (
                          <>
                            <button className="action-btn" title="Izmeni" onClick={(e) => {
                              e.stopPropagation();
                              setEditingCandidate(c);
                              setIsModalOpen(true);
                            }}>
                              <Edit size={18} style={{color: '#3B82F6'}} />
                            </button>
                            <button className="action-btn" title="Obriši" onClick={(e) => {
                              e.stopPropagation();
                              if(window.confirm('Da li ste sigurni da želite da obrišete ovog kandidata?')) {
                                deleteCandidate(c.id);
                              }
                            }}>
                              <Trash2 size={18} style={{color: 'var(--danger)'}} />
                            </button>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    Nema pronađenih kandidata.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
