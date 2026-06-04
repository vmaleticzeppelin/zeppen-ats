import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { EvaluationData } from '../context/EvaluationContext';
import './AdminFirstRoundView.css'; // Reusing styles

interface AdminSecondRoundViewProps {
  candidateId: string | number;
  branislavData?: EvaluationData;
  dusanData?: EvaluationData;
}

const AdminSecondRoundView: React.FC<AdminSecondRoundViewProps> = ({ candidateId, branislavData, dusanData }) => {
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
      { subject: 'Ownership (25%)', value: getAvg(['r2_s2_ownership', 'r2_s2_odgovornost', 'r2_s3_ownership', 'r2_s6_ownership']) },
      { subject: 'Organizacija (20%)', value: getAvg(['r2_s6_organizacija', 'r2_s6_prioritizacija', 'r2_s6_logika']) },
      { subject: 'Prodaja (20%)', value: getAvg(['r2_s5_prodajni', 'r2_s5_vodjenje', 'r2_s5_zakljucivanje', 'r2_s4_upornost']) },
      { subject: 'Stabilnost (15%)', value: getAvg(['r2_s3_stabilnost', 'r2_s6_stabilnost']) },
      { subject: 'Komunikacija (10%)', value: getAvg(['r2_s3_komunikacija', 'r2_s4_komunikacija']) },
      { subject: 'Kreativnost (5%)', value: getAvg(['r2_s7_kreativnost']) },
      { subject: 'Kultura (5%)', value: getAvg(['r2_s1_kompatibilnost', 'r2_s8_ambicija']) },
    ];
  };

  const calculateWeightedTotal = (radar: { subject: string; value: number }[]) => {
    if (!radar || radar.length === 0) return 0;
    // Težine po redu gore: 25, 20, 20, 15, 10, 5, 5
    const weights = [0.25, 0.20, 0.20, 0.15, 0.10, 0.05, 0.05];
    let total = 0;
    radar.forEach((r, i) => {
      total += r.value * weights[i];
    });
    return Math.round(total);
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
      { subject: 'Ownership (25%)', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Organizacija (20%)', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Prodaja (20%)', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Stabilnost (15%)', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Komunikacija (10%)', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Kreativnost (5%)', Branislav: 0, Dusan: 0, fullMark: 100 },
      { subject: 'Kultura (5%)', Branislav: 0, Dusan: 0, fullMark: 100 }
    );
  }

  const totalScoreB = calculateWeightedTotal(bRadar);
  const totalScoreD = calculateWeightedTotal(dRadar);
  const avgTotalScore = (branislavData && dusanData) ? Math.round((totalScoreB + totalScoreD) / 2) : (totalScoreB || totalScoreD);

  const renderText = (text: string | null | undefined) => {
    if (!text) return <span className="text-muted">Nema unosa</span>;
    return text;
  };

  const renderYesNo = (val: string | undefined) => {
    if (val === 'DA') return <span className="badge" style={{background: '#10b981', color: 'white'}}>DA</span>;
    if (val === 'NE') return <span className="badge" style={{background: '#ef4444', color: 'white'}}>NE</span>;
    return <span className="badge badge-secondary">Nije odgovoreno</span>;
  };

  return (
    <div className="admin-view-container">
      <div className="admin-header">
        <div>
          <h2 style={{margin: 0, color: 'var(--color-primary)'}}>Uporedni prikaz ocena - Drugi Krug</h2>
          <p className="text-muted" style={{marginTop: '0.25rem'}}>Analiza nezavisnih procena (Težinski ponderisano)</p>
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
            <div className="comparison-section" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{marginBottom: '0.5rem'}}><strong>Poveriti najvećeg klijenta?</strong> {renderYesNo(branislavData?.notes?.r2_final_najveci_klijent)}</p>
              <p><strong>Zaposliti danas?</strong> {renderYesNo(branislavData?.notes?.r2_final_zaposlio_danas)}</p>
            </div>

            <div className="comparison-section">
              <h4>Konačna Preporuka</h4>
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

            <div className="comparison-section">
              <h4>Potencijal za razvoj</h4>
              <p>{renderText(branislavData?.notes?.r2_final_potencijal)}</p>
            </div>

            <div className="comparison-section">
              <h4>Uklapanje u kulturu</h4>
              <p>{renderText(branislavData?.notes?.r2_final_kultura)}</p>
            </div>
            
            <div className="comparison-section danger-section">
              <h4>Konačne crvene zastavice</h4>
              <p>{renderText(branislavData?.redFlags?.r2_final_zastavice)}</p>
            </div>

            <div className="comparison-section" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              <h4>AI Analiza</h4>
              <p style={{whiteSpace: 'pre-line'}}>{renderText(branislavData?.notes?.ai_analiza)}</p>
            </div>

            <div className="comparison-section">
              <h4>Zapažanja po koracima</h4>
              <ul>
                <li><strong>S1 (Rekonekcija):</strong> {renderText(branislavData?.notes?.r2_s1)}</li>
                <li><strong>S2 (Ownership test):</strong> {renderText(branislavData?.notes?.r2_s2)}</li>
                <li><strong>S3 (Štampar):</strong> {renderText(branislavData?.notes?.r2_s3)}</li>
                <li><strong>S4 (Sekretarica):</strong> {renderText(branislavData?.notes?.r2_s4)}</li>
                <li><strong>S5 (Direktor mktg):</strong> {renderText(branislavData?.notes?.r2_s5)}</li>
                <li><strong>S6 (Prioritizacija):</strong> {renderText(branislavData?.notes?.r2_s6)}</li>
                <li><strong>S7 (Poklon projekat):</strong> {renderText(branislavData?.notes?.r2_s7)}</li>
                <li><strong>S8 (Motivacija):</strong> {renderText(branislavData?.notes?.r2_s8)}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="split-column">
          <div className="column-header" style={{borderBottomColor: '#10b981'}}>
            <h3>Ocene - Dušan</h3>
          </div>
          
          <div className="split-content">
            <div className="comparison-section" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <p style={{marginBottom: '0.5rem'}}><strong>Poveriti najvećeg klijenta?</strong> {renderYesNo(dusanData?.notes?.r2_final_najveci_klijent)}</p>
              <p><strong>Zaposliti danas?</strong> {renderYesNo(dusanData?.notes?.r2_final_zaposlio_danas)}</p>
            </div>

            <div className="comparison-section">
              <h4>Konačna Preporuka</h4>
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

            <div className="comparison-section">
              <h4>Potencijal za razvoj</h4>
              <p>{renderText(dusanData?.notes?.r2_final_potencijal)}</p>
            </div>

            <div className="comparison-section">
              <h4>Uklapanje u kulturu</h4>
              <p>{renderText(dusanData?.notes?.r2_final_kultura)}</p>
            </div>
            
            <div className="comparison-section danger-section">
              <h4>Konačne crvene zastavice</h4>
              <p>{renderText(dusanData?.redFlags?.r2_final_zastavice)}</p>
            </div>

            <div className="comparison-section" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              <h4>AI Analiza</h4>
              <p style={{whiteSpace: 'pre-line'}}>{renderText(dusanData?.notes?.ai_analiza)}</p>
            </div>

            <div className="comparison-section">
              <h4>Zapažanja po koracima</h4>
              <ul>
                <li><strong>S1 (Rekonekcija):</strong> {renderText(dusanData?.notes?.r2_s1)}</li>
                <li><strong>S2 (Ownership test):</strong> {renderText(dusanData?.notes?.r2_s2)}</li>
                <li><strong>S3 (Štampar):</strong> {renderText(dusanData?.notes?.r2_s3)}</li>
                <li><strong>S4 (Sekretarica):</strong> {renderText(dusanData?.notes?.r2_s4)}</li>
                <li><strong>S5 (Direktor mktg):</strong> {renderText(dusanData?.notes?.r2_s5)}</li>
                <li><strong>S6 (Prioritizacija):</strong> {renderText(dusanData?.notes?.r2_s6)}</li>
                <li><strong>S7 (Poklon projekat):</strong> {renderText(dusanData?.notes?.r2_s7)}</li>
                <li><strong>S8 (Motivacija):</strong> {renderText(dusanData?.notes?.r2_s8)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecondRoundView;
