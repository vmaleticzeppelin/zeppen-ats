import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { EvaluationData } from '../context/EvaluationContext';
import './AdminFirstRoundView.css'; // Reusing styles

interface AdminSecondRoundViewProps {
  candidateId: string | number;
  branislavData?: EvaluationData;
  dusanData?: EvaluationData;
}

const AdminSecondRoundView: React.FC<AdminSecondRoundViewProps> = ({ candidateId, branislavData, dusanData }) => {
  const [showPrintModal, setShowPrintModal] = useState(false);

  const calculateRadarData = (scores?: Record<string, number>) => {
    if (!scores) return [];
    
    const getAvg = (keys: string[]) => {
      let sum = 0;
      let count = 0;
      keys.forEach(k => {
        if (scores[k]) { sum += scores[k]; count++; }
      });
      return count === 0 ? 0 : Math.round((sum / count) * 20); // Scale to 100
    };

    return [
      { subject: 'Organizacija', value: getAvg(['r2_s3_organizacija', 'r2_s3_prioritizacija', 'r2_final_org']) },
      { subject: 'Prodaja', value: getAvg(['r2_s2_prodaja', 'r2_s2_zakljucivanje', 'r2_final_prodaja', 'r2_s5_pregovaranje']) },
      { subject: 'Ownership', value: getAvg(['r2_s1_ownership', 'r2_s3_ownership', 'r2_final_ownership', 'r2_s1_odgovornost']) },
      { subject: 'Komunikacija', value: getAvg(['r2_s2_vodjenje', 'r2_s5_komunikacija', 'r2_final_kom', 'r2_s6_prezentacija']) },
      { subject: 'Stabilnost', value: getAvg(['r2_s3_stabilnost', 'r2_s5_stabilnost', 'r2_s5_konflikt', 'r2_final_stab']) },
      { subject: 'Kultura', value: getAvg(['r2_s1_zrelost', 'r2_s6_kreativnost', 'r2_final_kultura']) },
    ];
  };

  const bRadar = calculateRadarData(branislavData?.scores);
  const dRadar = calculateRadarData(dusanData?.scores);

  const combinedRadarData = bRadar.length > 0 ? bRadar.map((item, index) => {
    const dItem = dRadar.find(d => d.subject === item.subject);
    return {
      subject: item.subject,
      Branislav: item.value || 0,
      Dusan: dItem?.value || 0,
      fullMark: 100
    };
  }) : dRadar.map(item => ({ subject: item.subject, Branislav: 0, Dusan: item.value || 0, fullMark: 100 }));

  if (combinedRadarData.length === 0) {
    combinedRadarData.push(
      { subject: 'Organizacija', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Prodaja', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Ownership', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Komunikacija', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Stabilnost', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Kultura', Branislav: 0, Dusan: 0, fullMark: 100 }
    );
  }

  const renderText = (text: string | null | undefined) => {
    if (!text) return <span className="text-muted">Nema unosa</span>;
    return text;
  };

  const totalScoreB = bRadar.length > 0 ? Math.round(bRadar.reduce((acc, curr) => acc + curr.value, 0) / bRadar.length) : 0;
  const totalScoreD = dRadar.length > 0 ? Math.round(dRadar.reduce((acc, curr) => acc + curr.value, 0) / dRadar.length) : 0;
  const avgTotalScore = (branislavData && dusanData) ? Math.round((totalScoreB + totalScoreD) / 2) : (totalScoreB || totalScoreD);

  return (
    <div className="admin-view-container">
      <div className="admin-header">
        <div>
          <h2 style={{margin: 0, color: 'var(--color-primary)'}}>Uporedni prikaz ocena - Drugi Krug</h2>
          <p className="text-muted" style={{marginTop: '0.25rem'}}>Analiza nezavisnih procena</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div className="total-score-badge">
            <span className="badge-label">Kombinovani Score</span>
            <span className="badge-value">{avgTotalScore}%</span>
          </div>
          <button className="btn-secondary" onClick={() => window.open(`/print/report-r2/${candidateId}`, '_blank')}>
            🖨️ Preuzmi PDF izveštaj
          </button>
        </div>
      </div>

      <div className="radar-comparison">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={combinedRadarData}>
            <PolarGrid stroke="#383D47" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A5B1', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Branislav" dataKey="Branislav" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            <Radar name="Dušan" dataKey="Dusan" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="radar-legend">
          <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#6366f1'}}></span> Branislav ({totalScoreB}%)</div>
          <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#10b981'}}></span> Dušan ({totalScoreD}%)</div>
        </div>
      </div>

      <div className="split-view">
        <div className="split-column">
          <div className="column-header" style={{borderBottomColor: '#6366f1'}}>
            <h3>Ocene - Branislav</h3>
          </div>
          
          <div className="split-content">
            <div className="comparison-section">
              <h4>Preporuka</h4>
              <p style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{renderText(branislavData?.recommendation)}</p>
            </div>

            <div className="comparison-section">
              <h4>Najveće prednosti</h4>
              <p>{renderText(branislavData?.notes?.r2_final_prednosti)}</p>
            </div>

            <div className="comparison-section">
              <h4>Najveći rizici</h4>
              <p>{renderText(branislavData?.notes?.r2_final_rizici)}</p>
            </div>
            
            <div className="comparison-section danger-section">
              <h4>Crvene zastavice</h4>
              <p>{renderText(branislavData?.redFlags?.r2_final_zastavice)}</p>
            </div>

            <div className="comparison-section">
              <h4>AI Analiza</h4>
              <p style={{whiteSpace: 'pre-line'}}>{renderText(branislavData?.notes?.ai_analiza)}</p>
            </div>

            <div className="comparison-section">
              <h4>Zapažanja po koracima</h4>
              <ul>
                <li><strong>S1 (Iskustvo):</strong> {renderText(branislavData?.notes?.r2_s1)}</li>
                <li><strong>S2 (Prodaja):</strong> {renderText(branislavData?.notes?.r2_s2)}</li>
                <li><strong>S3 (Organizacija):</strong> {renderText(branislavData?.notes?.r2_s3)}</li>
                <li><strong>S4 (Email):</strong> {renderText(branislavData?.notes?.r2_s4)}</li>
                <li><strong>S5 (Težak klijent):</strong> {renderText(branislavData?.notes?.r2_s5)}</li>
                <li><strong>S6 (Projekat):</strong> {renderText(branislavData?.notes?.r2_s6)}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="split-column">
          <div className="column-header" style={{borderBottomColor: '#10b981'}}>
            <h3>Ocene - Dušan</h3>
          </div>
          
          <div className="split-content">
            <div className="comparison-section">
              <h4>Preporuka</h4>
              <p style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{renderText(dusanData?.recommendation)}</p>
            </div>

            <div className="comparison-section">
              <h4>Najveće prednosti</h4>
              <p>{renderText(dusanData?.notes?.r2_final_prednosti)}</p>
            </div>

            <div className="comparison-section">
              <h4>Najveći rizici</h4>
              <p>{renderText(dusanData?.notes?.r2_final_rizici)}</p>
            </div>
            
            <div className="comparison-section danger-section">
              <h4>Crvene zastavice</h4>
              <p>{renderText(dusanData?.redFlags?.r2_final_zastavice)}</p>
            </div>

            <div className="comparison-section">
              <h4>AI Analiza</h4>
              <p style={{whiteSpace: 'pre-line'}}>{renderText(dusanData?.notes?.ai_analiza)}</p>
            </div>

            <div className="comparison-section">
              <h4>Zapažanja po koracima</h4>
              <ul>
                <li><strong>S1 (Iskustvo):</strong> {renderText(dusanData?.notes?.r2_s1)}</li>
                <li><strong>S2 (Prodaja):</strong> {renderText(dusanData?.notes?.r2_s2)}</li>
                <li><strong>S3 (Organizacija):</strong> {renderText(dusanData?.notes?.r2_s3)}</li>
                <li><strong>S4 (Email):</strong> {renderText(dusanData?.notes?.r2_s4)}</li>
                <li><strong>S5 (Težak klijent):</strong> {renderText(dusanData?.notes?.r2_s5)}</li>
                <li><strong>S6 (Projekat):</strong> {renderText(dusanData?.notes?.r2_s6)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecondRoundView;
