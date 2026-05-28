import React from 'react';
import { Calendar as CalendarIcon, Clock, Phone, User } from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { useNavigate } from 'react-router-dom';

const Calendar: React.FC = () => {
  const { candidates } = useCandidates();
  const navigate = useNavigate();

  // Filter and sort candidates with an interviewDate
  const scheduledCandidates = candidates
    .filter(c => c.interviewDate)
    .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime());

  return (
    <div className="process-container">
      <div className="page-header">
        <div className="header-info">
          <h1>Kalendar Razgovora</h1>
          <p>Pregled zakazanih intervjua sa kandidatima</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {scheduledCandidates.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 0' }}>
            <CalendarIcon size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem auto' }} />
            <h3>Nema zakazanih razgovora</h3>
            <p>Trenutno nema kandidata sa zakazanim datumom i vremenom intervjua.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scheduledCandidates.map(c => {
              const dateObj = new Date(c.interviewDate!);
              // Capitalize first letter of the weekday and month string
              const dateStr = dateObj.toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              const timeStr = dateObj.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={c.id} 
                  className="calendar-card"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1.5rem', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: 'var(--radius-md)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => navigate(`/process/${c.id}`)}
                >
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                      borderRadius: 'var(--radius-md)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--color-primary)'
                    }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{dateObj.getDate()}</span>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{dateObj.toLocaleString('sr-RS', { month: 'short' })}</span>
                    </div>
                    
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} /> {c.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} /> {timeStr} ({dateStr})
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={14} /> {c.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="badge badge-active" style={{ background: 'var(--color-background)' }}>Prikaži kandidata</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
