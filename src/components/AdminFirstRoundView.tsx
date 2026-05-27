import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { EvaluationData } from '../context/EvaluationContext';
import './FirstRoundWizard.css';

interface AdminViewProps {
  branislavData?: EvaluationData;
  dusanData?: EvaluationData;
}

const AdminFirstRoundView: React.FC<AdminViewProps> = ({ branislavData, dusanData }) => {
  const calcAvg = (keys: string[]) => {
    let sum = 0;
    let count = 0;
    keys.forEach(k => {
      if (branislavData?.scores[k]) { sum += branislavData.scores[k]; count++; }
      if (dusanData?.scores[k]) { sum += dusanData.scores[k]; count++; }
    });
    return count === 0 ? 0 : Math.round((sum / count) * 20); // out of 100
  };

  const radarData = [
    { subject: 'Energija', A: calcAvg(['s1_energija', 's3_energija', 's4_energija', 's5_energija']), fullMark: 100 },
    { subject: 'Komunikacija', A: calcAvg(['s1_komunikativnost', 's3_jasnoca', 's5_sigurnost', 's5_prirodnost', 's9_komunikacija']), fullMark: 100 },
    { subject: 'Organizacija', A: calcAvg(['s6_organizacija', 's8_organizovanost', 's8_sistematicnost', 's9_organizacija']), fullMark: 100 },
    { subject: 'Stabilnost', A: calcAvg(['s6_stabilnost', 's7_stabilnost', 's7_smirenost', 's9_stabilnost']), fullMark: 100 },
    { subject: 'Prodaja & Ownership', A: calcAvg(['s5_prodajni', 's6_ownership', 's7_ownership', 's9_ownership']), fullMark: 100 },
    { subject: 'Disciplina (CRM)', A: calcAvg(['s8_disciplina', 's8_crm', 's8_preciznost']), fullMark: 100 },
  ];

  const totalScore = Math.round(radarData.reduce((acc, curr) => acc + curr.A, 0) / radarData.length) || 0;

  return (
    <div className="admin-view-container card">
      <h2>Pregled ocena - Prvi krug</h2>
      
      <div className="final-grid">
        <div className="admin-notes">
          <div className="split-view">
            <div className="evaluator-column">
              <h3 style={{color: 'var(--color-primary)'}}>Branislav (Intervjuer 1)</h3>
              {branislavData ? (
                <>
                  <div className="admin-note-box">
                    <strong>Prvi utisak:</strong> {branislavData.notes.s1 || 'Nema beleški'}
                  </div>
                  <div className="admin-note-box">
                    <strong>Motivacija:</strong> {branislavData.notes.s4 || 'Nema beleški'}
                  </div>
                  <div className="admin-note-box">
                    <strong>Krizna situacija:</strong> {branislavData.notes.s9 || 'Nema beleški'}
                  </div>
                  <div className="admin-note-box text-danger">
                    <strong>Crvene zastavice:</strong> {Object.values(branislavData.redFlags).join(', ') || 'Nema zastavica'}
                  </div>
                  <div className="admin-note-box">
                    <strong>Preporuka:</strong> <span className="badge badge-primary">{branislavData.recommendation || 'Nije definisano'}</span>
                  </div>
                </>
              ) : <p>Nije još ocenio.</p>}
            </div>

            <div className="evaluator-column">
              <h3 style={{color: '#8b5cf6'}}>Dušan (Intervjuer 2)</h3>
              {dusanData ? (
                <>
                  <div className="admin-note-box">
                    <strong>Prvi utisak:</strong> {dusanData.notes.s1 || 'Nema beleški'}
                  </div>
                  <div className="admin-note-box">
                    <strong>Motivacija:</strong> {dusanData.notes.s4 || 'Nema beleški'}
                  </div>
                  <div className="admin-note-box">
                    <strong>Krizna situacija:</strong> {dusanData.notes.s9 || 'Nema beleški'}
                  </div>
                  <div className="admin-note-box text-danger">
                    <strong>Crvene zastavice:</strong> {Object.values(dusanData.redFlags).join(', ') || 'Nema zastavica'}
                  </div>
                  <div className="admin-note-box">
                    <strong>Preporuka:</strong> <span className="badge badge-primary">{dusanData.recommendation || 'Nije definisano'}</span>
                  </div>
                </>
              ) : <p>Nije još ocenio.</p>}
            </div>
          </div>
        </div>

        <div className="final-stats">
          <div className="total-score-box">
            <span className="ts-label">Prosečan Score</span>
            <span className="ts-value">{totalScore}%</span>
            <span className="ts-sub">Na osnovu oba intervjuera</span>
          </div>
          
          <div className="radar-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#383D47" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A5B1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Kandidat" dataKey="A" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFirstRoundView;
