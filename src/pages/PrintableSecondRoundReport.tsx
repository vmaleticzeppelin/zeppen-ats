import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { useEvaluations } from '../context/EvaluationContext';
import './PrintableCandidateReport.css'; // Reusing styles

const PrintableSecondRoundReport: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById } = useCandidates();
  const { getEvaluation } = useEvaluations();

  const candidate = id ? getCandidateById(id) : null;
  const branislav = getEvaluation(String(id), 'Branislav', 2);
  const dusan = getEvaluation(String(id), 'Dusan', 2);

  useEffect(() => {
    if (!candidate) return;
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, [candidate]);

  if (!candidate) {
    return <div>Kandidat nije pronađen. <button onClick={() => navigate('/candidates')}>Nazad</button></div>;
  }

  const renderText = (text: string | null | undefined) => {
    if (!text) return <span style={{ color: '#999', fontStyle: 'italic' }}>Nema unosa</span>;
    return text;
  };

  const calculateRadarData = (scores?: Record<string, number>) => {
    if (!scores) return [];
    const getAvg = (keys: string[]) => {
      let sum = 0, count = 0;
      keys.forEach(k => { if (scores[k]) { sum += scores[k]; count++; } });
      return count === 0 ? 0 : Math.round((sum / count) * 20); 
    };
    return [
      { subject: 'Ownership', value: getAvg(['r2_s2_ownership', 'r2_s2_odgovornost', 'r2_s3_ownership', 'r2_s6_ownership']) },
      { subject: 'Organizacija', value: getAvg(['r2_s6_organizacija', 'r2_s6_prioritizacija', 'r2_s6_logika']) },
      { subject: 'Prodaja', value: getAvg(['r2_s5_prodajni', 'r2_s5_vodjenje', 'r2_s5_zakljucivanje', 'r2_s4_upornost']) },
      { subject: 'Stabilnost', value: getAvg(['r2_s3_stabilnost', 'r2_s6_stabilnost']) },
      { subject: 'Komunikacija', value: getAvg(['r2_s3_komunikacija', 'r2_s4_komunikacija']) },
      { subject: 'Kreativnost', value: getAvg(['r2_s7_kreativnost']) },
      { subject: 'Kultura', value: getAvg(['r2_s1_kompatibilnost', 'r2_s8_ambicija']) },
    ];
  };

  const calculateWeightedTotal = (radar: { subject: string; value: number }[]) => {
    if (!radar || radar.length === 0) return 0;
    const weights = [0.25, 0.20, 0.20, 0.15, 0.10, 0.05, 0.05];
    let total = 0;
    radar.forEach((r, i) => {
      total += r.value * weights[i];
    });
    return Math.round(total);
  };

  const bRadar = calculateRadarData(branislav?.scores);
  const dRadar = calculateRadarData(dusan?.scores);
  const totalScoreB = calculateWeightedTotal(bRadar);
  const totalScoreD = calculateWeightedTotal(dRadar);
  const avgTotalScore = (branislav && dusan) ? Math.round((totalScoreB + totalScoreD) / 2) : (totalScoreB || totalScoreD);

  return (
    <div className="print-report-container">
      <div className="report-header">
        <h1>UPOREDNI IZVEŠTAJ DRUGOG KRUGA (Praktična procena)</h1>
        <div className="info-grid">
          <div className="info-item"><strong>Kandidat:</strong> {candidate.name}</div>
          <div className="info-item"><strong>Email:</strong> {candidate.email}</div>
          <div className="info-item"><strong>Telefon:</strong> {candidate.phone}</div>
          <div className="info-item"><strong>Kombinovani Score:</strong> {avgTotalScore}%</div>
        </div>
      </div>

      <div className="section-title">Finalna Preporuka i Ukupan Utisak</div>
      <div className="evaluator-comparison">
        <div className="evaluator-column">
          <h3>Branislav ({totalScoreB}%)</h3>
          <p><strong>Najveći klijent:</strong> {renderText(branislav?.notes?.r2_final_najveci_klijent)}</p>
          <p><strong>Zaposlio danas:</strong> {renderText(branislav?.notes?.r2_final_zaposlio_danas)}</p>
          <h4>Konačna preporuka</h4>
          {renderText(branislav?.recommendation)}
          <h4>Najveće prednosti</h4>
          {renderText(branislav?.notes?.r2_final_prednosti)}
          <h4>Najveći rizici</h4>
          {renderText(branislav?.notes?.r2_final_rizici)}
          <h4>Potencijal za razvoj</h4>
          {renderText(branislav?.notes?.r2_final_potencijal)}
          <h4>Uklapanje u kulturu</h4>
          {renderText(branislav?.notes?.r2_final_kultura)}
          <h4>Konačne crvene zastavice</h4>
          <div className="danger-text">{renderText(branislav?.redFlags?.r2_final_zastavice)}</div>
          
          <h4>AI Analiza</h4>
          <div className="report-text" style={{ fontSize: '11px', background: '#f5f5f5', padding: '5px' }}>
            {renderText(branislav?.notes?.ai_analiza)}
          </div>
        </div>
        <div className="evaluator-column">
          <h3>Dušan ({totalScoreD}%)</h3>
          <p><strong>Najveći klijent:</strong> {renderText(dusan?.notes?.r2_final_najveci_klijent)}</p>
          <p><strong>Zaposlio danas:</strong> {renderText(dusan?.notes?.r2_final_zaposlio_danas)}</p>
          <h4>Konačna preporuka</h4>
          {renderText(dusan?.recommendation)}
          <h4>Najveće prednosti</h4>
          {renderText(dusan?.notes?.r2_final_prednosti)}
          <h4>Najveći rizici</h4>
          {renderText(dusan?.notes?.r2_final_rizici)}
          <h4>Potencijal za razvoj</h4>
          {renderText(dusan?.notes?.r2_final_potencijal)}
          <h4>Uklapanje u kulturu</h4>
          {renderText(dusan?.notes?.r2_final_kultura)}
          <h4>Konačne crvene zastavice</h4>
          <div className="danger-text">{renderText(dusan?.redFlags?.r2_final_zastavice)}</div>
          
          <h4>AI Analiza</h4>
          <div className="report-text" style={{ fontSize: '11px', background: '#f5f5f5', padding: '5px' }}>
            {renderText(dusan?.notes?.ai_analiza)}
          </div>
        </div>
      </div>

      <div className="page-break"></div>

      <div className="section-title">Detaljne beleške po koracima</div>
      
      {[
        { id: 'r2_s1', title: 'S1 - Rekonekcija' },
        { id: 'r2_s2', title: 'S2 - Ownership test' },
        { id: 'r2_s3', title: 'S3 - Problem sa štamparom' },
        { id: 'r2_s4', title: 'S4 - Hladni poziv (Sekretarica)' },
        { id: 'r2_s5', title: 'S5 - Hladni poziv (Direktor)' },
        { id: 'r2_s6', title: 'S6 - Prioritizacija' },
        { id: 'r2_s7', title: 'S7 - Poklon projekat' },
        { id: 'r2_s8', title: 'S8 - Motivacija' }
      ].map(step => (
        <div key={step.id} className="no-break" style={{ marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '20px' }}>{step.title}</h3>
          
          <div className="evaluator-comparison" style={{ marginBottom: 0 }}>
            <div className="evaluator-column" style={{ border: 'none', borderRight: '1px solid #eee', borderRadius: 0, padding: '0 15px 0 0' }}>
              <strong>Branislav:</strong>
              {renderText(branislav?.notes?.[step.id])}
              {branislav?.redFlags?.[step.id] && (
                <div className="danger-text">
                  <small>Crvene zastavice:</small><br/>
                  {branislav.redFlags[step.id]}
                </div>
              )}
            </div>
            <div className="evaluator-column" style={{ border: 'none', borderRadius: 0, padding: '0 0 0 15px' }}>
              <strong>Dušan:</strong>
              {renderText(dusan?.notes?.[step.id])}
              {dusan?.redFlags?.[step.id] && (
                <div className="danger-text">
                  <small>Crvene zastavice:</small><br/>
                  {dusan.redFlags[step.id]}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintableSecondRoundReport;
