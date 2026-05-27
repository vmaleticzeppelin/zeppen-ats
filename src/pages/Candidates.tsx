import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, FileText, Phone, Trash2 } from 'lucide-react';
import { candidatesList } from '../data/mockData';
import AddCandidateModal from '../components/AddCandidateModal';
import './Candidates.css';

const getStatusBadgeClass = (status: string) => {
  if (status === 'Novi kandidat') return 'badge-new';
  if (status === 'Zaposlen' || status === 'Probni rad') return 'badge-hired';
  if (status.includes('Odbijen')) return 'badge-rejected';
  return 'badge-active';
};

const Candidates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Svi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState(candidatesList);

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Svi' || c.status.includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleAddCandidate = (newCandidate: any) => {
    setCandidates([newCandidate, ...candidates]);
  };

  return (
    <div className="candidates-container">
      <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddCandidate} />
      
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
                <th>Prijava / Izvor</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c) => (
                <tr key={c.id}>
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
                      <span className="c-source">{c.source}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn" title="Pogledaj CV" onClick={() => {
                        const candidateAny = c as any;
                        if (candidateAny.cvUrl) {
                          window.open(candidateAny.cvUrl, '_blank');
                        } else {
                          alert('Ovaj kandidat nema postavljen CV.');
                        }
                      }}>
                        <FileText size={18} />
                      </button>
                      <button className="action-btn" title="Obriši" onClick={() => {
                        if(window.confirm('Da li ste sigurni da želite da obrišete ovog kandidata?')) {
                          setCandidates(candidates.filter(cand => cand.id !== c.id));
                        }
                      }}>
                        <Trash2 size={18} style={{color: 'var(--danger)'}} />
                      </button>
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
