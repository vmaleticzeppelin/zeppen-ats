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
      { subject: 'Organizacija', value: getAvg(['r2_s3_organizacija', 'r2_s3_prioritizacija', 'r2_final_org']) },
      { subject: 'Prodaja', value: getAvg(['r2_s2_prodaja', 'r2_s2_zakljucivanje', 'r2_final_prodaja', 'r2_s5_pregovaranje']) },
      { subject: 'Ownership', value: getAvg(['r2_s1_ownership', 'r2_s3_ownership', 'r2_final_ownership', 'r2_s1_odgovornost']) },
      { subject: 'Komunikacija', value: getAvg(['r2_s2_vodjenje', 'r2_s5_komunikacija', 'r2_final_kom', 'r2_s6_prezentacija']) },
      { subject: 'Stabilnost', value: getAvg(['r2_s3_stabilnost', 'r2_s5_stabilnost', 'r2_s5_konflikt', 'r2_final_stab']) },
      { subject: 'Kultura', value: getAvg(['r2_s1_zrelost', 'r2_s6_kreativnost', 'r2_final_kultura']) },
    ];
  };

  const bRadar = calculateRadarData(branislav?.scores);
  const dRadar = calculateRadarData(dusan?.scores);
  const totalScoreB = bRadar.length > 0 ? Math.round(bRadar.reduce((acc, curr) => acc + curr.value, 0) / bRadar.length) : 0;
  const totalScoreD = dRadar.length > 0 ? Math.round(dRadar.reduce((acc, curr) => acc + curr.value, 0) / dRadar.length) : 0;
  const avgTotalScore = (branislav && dusan) ? Math.round((totalScoreB + totalScoreD) / 2) : (totalScoreB || totalScoreD);

  return (
    <div className="printable-report-container">
      <div className="report-header">
        <h1>UPOREDNI IZVEŠTAJ DRUGOG KRUGA (Praktična procena)</h1>
        <div className="candidate-info-grid">
          <div><strong>Kandidat:</strong> {candidate.name}</div>
          <div><strong>Email:</strong> {candidate.email}</div>
          <div><strong>Telefon:</strong> {candidate.phone}</div>
          <div><strong>Kombinovani Score:</strong> {avgTotalScore}%</div>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-col">
          <h3 style={{ borderBottom: '2px solid #333' }}>Branislav ({totalScoreB}%)</h3>
          <p><strong>Preporuka:</strong> {renderText(branislav?.recommendation)}</p>
          <p><strong>Prednosti:</strong> {renderText(branislav?.notes?.r2_final_prednosti)}</p>
          <p><strong>Rizici:</strong> {renderText(branislav?.notes?.r2_final_rizici)}</p>
          <p><strong>Crvene zastavice:</strong> {renderText(branislav?.redFlags?.r2_final_zastavice)}</p>
          <p><strong>Potencijal:</strong> {renderText(branislav?.notes?.r2_final_potencijal)}</p>
          <p><strong>Uklapanje:</strong> {renderText(branislav?.notes?.r2_final_kultura)}</p>
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f5f5f5' }}>
            <p style={{ fontWeight: 'bold' }}>AI Analiza:</p>
            <p style={{ whiteSpace: 'pre-line', fontSize: '0.9em' }}>{renderText(branislav?.notes?.ai_analiza)}</p>
          </div>
        </div>
        <div className="summary-col">
          <h3 style={{ borderBottom: '2px solid #333' }}>Dušan ({totalScoreD}%)</h3>
          <p><strong>Preporuka:</strong> {renderText(dusan?.recommendation)}</p>
          <p><strong>Prednosti:</strong> {renderText(dusan?.notes?.r2_final_prednosti)}</p>
          <p><strong>Rizici:</strong> {renderText(dusan?.notes?.r2_final_rizici)}</p>
          <p><strong>Crvene zastavice:</strong> {renderText(dusan?.redFlags?.r2_final_zastavice)}</p>
          <p><strong>Potencijal:</strong> {renderText(dusan?.notes?.r2_final_potencijal)}</p>
          <p><strong>Uklapanje:</strong> {renderText(dusan?.notes?.r2_final_kultura)}</p>
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f5f5f5' }}>
            <p style={{ fontWeight: 'bold' }}>AI Analiza:</p>
            <p style={{ whiteSpace: 'pre-line', fontSize: '0.9em' }}>{renderText(dusan?.notes?.ai_analiza)}</p>
          </div>
        </div>
      </div>

      <div className="page-break"></div>

      <h2>DETALJNE BELEŠKE PO KORACIMA (DRUGI KRUG)</h2>
      <table className="details-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Korak</th>
            <th style={{ width: '40%' }}>Branislav</th>
            <th style={{ width: '40%' }}>Dušan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>S1 - Iskustvo</strong></td>
            <td>{renderText(branislav?.notes?.r2_s1)}</td>
            <td>{renderText(dusan?.notes?.r2_s1)}</td>
          </tr>
          <tr>
            <td><strong>S2 - Prodaja</strong></td>
            <td>{renderText(branislav?.notes?.r2_s2)}</td>
            <td>{renderText(dusan?.notes?.r2_s2)}</td>
          </tr>
          <tr>
            <td><strong>S3 - Organizacija</strong></td>
            <td>{renderText(branislav?.notes?.r2_s3)}</td>
            <td>{renderText(dusan?.notes?.r2_s3)}</td>
          </tr>
          <tr>
            <td><strong>S4 - Email test</strong></td>
            <td>{renderText(branislav?.notes?.r2_s4)}</td>
            <td>{renderText(dusan?.notes?.r2_s4)}</td>
          </tr>
          <tr>
            <td><strong>S5 - Težak klijent</strong></td>
            <td>{renderText(branislav?.notes?.r2_s5)}</td>
            <td>{renderText(dusan?.notes?.r2_s5)}</td>
          </tr>
          <tr>
            <td><strong>S6 - Poklon projekat</strong></td>
            <td>{renderText(branislav?.notes?.r2_s6)}</td>
            <td>{renderText(dusan?.notes?.r2_s6)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintableSecondRoundReport;
