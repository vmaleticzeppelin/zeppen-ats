import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { useEvaluations } from '../context/EvaluationContext';
import './PrintableCandidateReport.css';

const PrintableCandidateReport: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCandidateById } = useCandidates();
  const { getEvaluation } = useEvaluations();

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 1000);
  }, []);

  const candidate = id ? getCandidateById(id) : null;
  const branislav = getEvaluation(String(id), 'Branislav');
  const dusan = getEvaluation(String(id), 'Dusan');

  if (!candidate) {
    return <div>Kandidat nije pronađen.</div>;
  }

  // Koristi podatke iz bilo kog evaluation-a za osnovne info, prioritet Branislav pa Dušan
  const baseNotes = branislav?.notes || dusan?.notes || {};
  
  const steps = [
    { id: 's1', title: '1. Dolazak i prvi utisak' },
    { id: 's3', title: '3. O kandidatu' },
    { id: 's4', title: '4. Motivacija' },
    { id: 's5', title: '5. Komunikacija i telefon' },
    { id: 's6', title: '6. Organizacija i multitasking' },
    { id: 's7', title: '7. Stres i pritisak' },
    { id: 's8', title: '8. CRM i Administracija' },
    { id: 's9', title: '9. Scenario (Klijent viče)' }
  ];

  const renderText = (text?: string | null) => {
    if (!text || text.trim() === '') return <div className="empty-text">Nema unetih beleški.</div>;
    return <div className="report-text">{text}</div>;
  };

  const calcIndividualAvg = (data: any, keys: string[]) => {
    if (!data || !data.scores) return 0;
    let sum = 0;
    let count = 0;
    keys.forEach(k => {
      if (data.scores[k]) { sum += data.scores[k]; count++; }
    });
    return count === 0 ? 0 : Math.round((sum / count) * 20);
  };

  const calculateTotalScore = (data: any) => {
    if (!data) return 0;
    const radar = [
      calcIndividualAvg(data, ['s1_energija', 's3_energija', 's4_energija', 's5_energija']),
      calcIndividualAvg(data, ['s1_komunikativnost', 's3_jasnoca', 's5_sigurnost', 's5_prirodnost', 's9_komunikacija']),
      calcIndividualAvg(data, ['s6_organizacija', 's8_organizovanost', 's8_sistematicnost', 's9_organizacija']),
      calcIndividualAvg(data, ['s6_stabilnost', 's7_stabilnost', 's7_smirenost', 's9_stabilnost']),
      calcIndividualAvg(data, ['s5_prodajni', 's6_ownership', 's7_ownership', 's9_ownership']),
      calcIndividualAvg(data, ['s8_disciplina', 's8_crm', 's8_preciznost'])
    ];
    return Math.round(radar.reduce((acc, curr) => acc + curr, 0) / 6);
  };

  const bScore = calculateTotalScore(branislav);
  const dScore = calculateTotalScore(dusan);

  return (
    <div className="print-report-container">
      <div className="report-header">
        <h1>Zeppelin Pro - Izveštaj sa intervjua</h1>
        <h2>Kandidat: {candidate.name}</h2>
      </div>

      <div className="section-title">Osnovne informacije o kandidatu</div>
      <div className="info-grid">
        <div className="info-item"><strong>Prethodno iskustvo:</strong> {baseNotes.iskustvo || '-'}</div>
        <div className="info-item"><strong>Poslednja firma:</strong> {baseNotes.poslednjaFirma || '-'}</div>
        <div className="info-item"><strong>Očekivana primanja:</strong> {baseNotes.ocekivanaPlata || '-'}</div>
        <div className="info-item"><strong>Dostupnost:</strong> {baseNotes.dostupnost || '-'}</div>
        <div className="info-item"><strong>Engleski jezik:</strong> {baseNotes.engleskiNivo || '-'}</div>
        <div className="info-item"><strong>Razlog promene posla:</strong> {baseNotes.razlogPromene || '-'}</div>
      </div>
      
      <div className="info-grid" style={{ display: 'block', marginBottom: '30px' }}>
        <div className="info-item" style={{ marginBottom: '10px' }}>
          <strong>Opis nivoa engleskog:</strong><br/>
          {renderText(baseNotes.engleskiOpis)}
        </div>
        <div className="info-item">
          <strong>Rad na računaru:</strong><br/>
          {renderText(baseNotes.racunarZnanje)}
        </div>
      </div>

      <div className="section-title">Finalna Preporuka i Ukupan Utisak</div>
      <div className="evaluator-comparison">
        <div className="evaluator-column">
          <h3>Branislav ({bScore}% Score)</h3>
          <h4>Ukupan utisak (1-10)</h4>
          {renderText(branislav?.recommendation)}
          
          <h4>Najveće prednosti</h4>
          {renderText(branislav?.notes?.final_prednosti)}
          
          <h4>Najveći rizici</h4>
          {renderText(branislav?.notes?.final_rizici)}
          
          <h4>Potencijal za razvoj</h4>
          {renderText(branislav?.notes?.final_potencijal)}
          
          <h4>Kultura firme</h4>
          {renderText(branislav?.notes?.final_kultura)}
          
          <h4>Crvene zastavice (Generalne)</h4>
          <div className="danger-text">{renderText(branislav?.redFlags?.final_zastavice)}</div>
        </div>
        
        <div className="evaluator-column">
          <h3>Dušan ({dScore}% Score)</h3>
          <h4>Ukupan utisak (1-10)</h4>
          {renderText(dusan?.recommendation)}
          
          <h4>Najveće prednosti</h4>
          {renderText(dusan?.notes?.final_prednosti)}
          
          <h4>Najveći rizici</h4>
          {renderText(dusan?.notes?.final_rizici)}
          
          <h4>Potencijal za razvoj</h4>
          {renderText(dusan?.notes?.final_potencijal)}
          
          <h4>Kultura firme</h4>
          {renderText(dusan?.notes?.final_kultura)}
          
          <h4>Crvene zastavice (Generalne)</h4>
          <div className="danger-text">{renderText(dusan?.redFlags?.final_zastavice)}</div>
        </div>
      </div>

      <div className="page-break"></div>

      <div className="section-title">Detaljne beleške po koracima</div>
      
      {steps.map(step => (
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

export default PrintableCandidateReport;
