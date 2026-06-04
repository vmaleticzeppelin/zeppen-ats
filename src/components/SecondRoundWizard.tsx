import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEvaluations } from '../context/EvaluationContext';
import { useAuth } from '../context/AuthContext';
import './FirstRoundWizard.css'; // Reusing styles

const steps = [
  { id: 1, title: 'KORAK 1: Rekonekcija' },
  { id: 2, title: 'KORAK 2: Ownership Test' },
  { id: 3, title: 'KORAK 3: Problem sa štamparom' },
  { id: 4, title: 'KORAK 4: Hladni poziv (Sekretarica)' },
  { id: 5, title: 'KORAK 5: Hladni poziv (Direktor)' },
  { id: 6, title: 'KORAK 6: Prioritizacija' },
  { id: 7, title: 'KORAK 7: Poklon projekat' },
  { id: 8, title: 'KORAK 8: Motivacija' },
  { id: 9, title: 'ZAVRŠNA PROCENA' }
];

export default function SecondRoundWizard({ candidateId }: { candidateId: string | number }) {
  const { currentUser } = useAuth();
  const { getEvaluation, saveEvaluation } = useEvaluations();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [redFlags, setRedFlags] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    if (currentUser && candidateId) {
      const data = getEvaluation(String(candidateId), currentUser as any, 2);
      if (data) {
        if (data.scores) setScores(data.scores);
        if (data.notes) setNotes(data.notes);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.recommendation) setRecommendation(data.recommendation);
      }
    }
  }, [candidateId, currentUser]);

  const handleScore = (key: string, val: number) => setScores(prev => ({ ...prev, [key]: val }));
  const handleNote = (key: string, val: string) => setNotes(prev => ({ ...prev, [key]: val }));
  const handleFlag = (key: string, val: string) => setRedFlags(prev => ({ ...prev, [key]: val }));

  const generateSimpleAI = () => {
    // Težine:
    // Ownership – 25% (r2_s2_ownership, r2_s2_odgovornost, r2_s3_ownership, r2_s6_ownership)
    // Organizacija – 20% (r2_s6_organizacija, r2_s6_prioritizacija, r2_s6_logika)
    // Prodajni potencijal – 20% (r2_s5_prodajni, r2_s5_vodjenje, r2_s5_zakljucivanje, r2_s4_upornost)
    // Stabilnost – 15% (r2_s3_stabilnost, r2_s6_stabilnost)
    // Komunikacija – 10% (r2_s3_komunikacija, r2_s4_komunikacija)
    // Kreativnost – 5% (r2_s7_kreativnost)
    // Uklapanje u kulturu – 5% (r2_s1_kompatibilnost, r2_s8_ambicija)

    const getAvg = (keys: string[]) => {
      let sum = 0, count = 0;
      keys.forEach(k => { if (scores[k]) { sum += scores[k]; count++; } });
      return count === 0 ? 0 : Math.round((sum / count) * 20); // Scale to 100
    };

    const ownership = getAvg(['r2_s2_ownership', 'r2_s2_odgovornost', 'r2_s3_ownership', 'r2_s6_ownership']);
    const org = getAvg(['r2_s6_organizacija', 'r2_s6_prioritizacija', 'r2_s6_logika']);
    const prodaja = getAvg(['r2_s5_prodajni', 'r2_s5_vodjenje', 'r2_s5_zakljucivanje', 'r2_s4_upornost']);
    const stab = getAvg(['r2_s3_stabilnost', 'r2_s6_stabilnost']);
    const kom = getAvg(['r2_s3_komunikacija', 'r2_s4_komunikacija']);
    const kreat = getAvg(['r2_s7_kreativnost']);
    const kultura = getAvg(['r2_s1_kompatibilnost', 'r2_s8_ambicija']);

    const total = Math.round(
      ownership * 0.25 + 
      org * 0.20 + 
      prodaja * 0.20 + 
      stab * 0.15 + 
      kom * 0.10 + 
      kreat * 0.05 + 
      kultura * 0.05
    );

    let summary = `🤖 [SIMULIRANA AI ANALIZA]\n`;
    summary += `Kombinovani Skor: ${total}%\n\n`;
    summary += `* Procena ownership mindset-a: ${ownership}% - ${ownership > 80 ? 'Izvanredno' : ownership > 60 ? 'Dobro' : 'Rizik'}\n`;
    summary += `* Procena organizacionih sposobnosti: ${org}% - ${org > 80 ? 'Odličan' : org > 60 ? 'Prosečan' : 'Loš'}\n`;
    summary += `* Procena prodajnog potencijala: ${prodaja}% - ${prodaja > 80 ? 'Visok' : prodaja > 60 ? 'Osrednji' : 'Nizak'}\n`;
    summary += `* Procena stabilnosti pod pritiskom: ${stab}%\n`;
    summary += `* Procena uklapanja u kulturu Zeppelin Pro: ${kultura}%\n\n`;
    summary += `Glavne prednosti:\n${notes.r2_final_prednosti || 'Nije uneto'}\n\n`;
    summary += `Glavni rizici:\n${notes.r2_final_rizici || 'Nije uneto'}\n\n`;
    summary += `Konačna preporuka: ${recommendation || 'Nije odabrano'}\n`;

    return summary;
  };

  const saveCurrentProgress = () => {
    if (!currentUser) return;
    
    const finalNotes = { ...notes };
    if (currentStep === 9) {
      finalNotes.ai_analiza = generateSimpleAI();
    }

    saveEvaluation(String(candidateId), currentUser as any, {
      scores,
      notes: finalNotes,
      redFlags,
      recommendation
    }, 2);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const validateStep = () => {
    let reqScores: string[] = [];
    let reqNotes: string[] = [];
    
    if (currentStep === 1) {
      reqScores = ['r2_s1_zainteresovanost', 'r2_s1_energija', 'r2_s1_pripremljenost', 'r2_s1_kompatibilnost'];
      reqNotes = ['r2_s1'];
    } else if (currentStep === 2) {
      reqScores = ['r2_s2_ownership', 'r2_s2_odgovornost', 'r2_s2_iskrenost', 'r2_s2_zrelost', 'r2_s2_ucenje'];
      reqNotes = ['r2_s2'];
    } else if (currentStep === 3) {
      reqScores = ['r2_s3_ownership', 'r2_s3_komunikacija', 'r2_s3_empatija', 'r2_s3_stabilnost', 'r2_s3_resavanje', 'r2_s3_ocekivanja'];
      reqNotes = ['r2_s3'];
    } else if (currentStep === 4) {
      reqScores = ['r2_s4_upornost', 'r2_s4_energija', 'r2_s4_komunikacija', 'r2_s4_snalazljivost', 'r2_s4_profesionalnost'];
      reqNotes = ['r2_s4'];
    } else if (currentStep === 5) {
      reqScores = ['r2_s5_prodajni', 'r2_s5_slusanje', 'r2_s5_pitanja', 'r2_s5_vodjenje', 'r2_s5_zakljucivanje'];
      reqNotes = ['r2_s5'];
    } else if (currentStep === 6) {
      reqScores = ['r2_s6_organizacija', 'r2_s6_logika', 'r2_s6_prioritizacija', 'r2_s6_ownership', 'r2_s6_stabilnost'];
      reqNotes = ['r2_s6'];
    } else if (currentStep === 7) {
      reqScores = ['r2_s7_logika', 'r2_s7_kreativnost', 'r2_s7_potrebe', 'r2_s7_prezentacija', 'r2_s7_komercijalno'];
      reqNotes = ['r2_s7'];
    } else if (currentStep === 8) {
      reqScores = ['r2_s8_motivacija', 'r2_s8_ambicija', 'r2_s8_proaktivnost', 'r2_s8_ucenje'];
      reqNotes = ['r2_s8'];
    } else if (currentStep === 9) {
      if (!notes.r2_final_najveci_klijent || !notes.r2_final_zaposlio_danas || !recommendation) {
        setValidationError('Morate odgovoriti na DA/NE pitanja i doneti preporuku.');
        return false;
      }
      reqNotes = ['r2_final_prednosti', 'r2_final_rizici', 'r2_final_potencijal', 'r2_final_kultura'];
    }

    const missingScores = reqScores.some(s => !scores[s]);
    const missingNotes = reqNotes.some(n => !notes[n] || notes[n].trim() === '');
    
    if (missingScores) {
      setValidationError('Molimo ocenite sve stavke (1-5) pre prelaska na sledeći korak.');
      return false;
    }
    if (missingNotes) {
      setValidationError('Polja za beleške su obavezna.');
      return false;
    }

    setValidationError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      saveCurrentProgress();
      setCurrentStep(prev => Math.min(prev + 1, 9));
      window.scrollTo(0, 0);
    }
  };

  const renderStars = (key: string, label: string) => (
    <div className="rating-row-wiz">
      <div className="rating-label">
        <span>{label}</span>
      </div>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            className={`star-btn ${scores[key] === num ? 'active' : ''}`}
            onClick={() => handleScore(key, num)}
          >
            ★ {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="wizard-container card">
      <div className="wizard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{steps[currentStep - 1].title}</h2>
          <button className="btn-secondary" onClick={() => window.open('/print/second-round', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🖨️ Prazan obrazac za 2. Krug
          </button>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(currentStep / 9) * 100}%` }}></div>
        </div>
        <div className="step-indicator">Korak {currentStep} od 9</div>
      </div>

      {validationError && (
        <div className="alert-danger" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} /> {validationError}
        </div>
      )}

      <div className="wizard-body">
        {currentStep === 1 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>CILJ:</h3>
              <p>Opustiti kandidata. Proceniti nivo zainteresovanosti i koliko je razmišljao o Zeppelin Pro nakon prvog kruga. (5 min)</p>
              <h4>PITANJE:</h4>
              <p><em>"Prošlo je nekoliko dana od našeg prvog razgovora. Kako vam danas izgleda naša priča i šta vam je najviše ostalo u sećanju iz razgovora o firmi i poziciji?"</em></p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s1_zainteresovanost', 'Zainteresovanost')}
              {renderStars('r2_s1_energija', 'Energija')}
              {renderStars('r2_s1_pripremljenost', 'Pripremljenost')}
              {renderStars('r2_s1_kompatibilnost', 'Kompatibilnost sa firmom')}
            </div>
            <div className="input-group">
              <label>Beleške (da li je istraživao, fokus, energija) *</label>
              <textarea rows={3} value={notes.r2_s1 || ''} onChange={e => handleNote('r2_s1', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s1 || ''} onChange={e => handleFlag('r2_s1', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>OWNERSHIP TEST (10 min)</h3>
              <h4>PITANJA:</h4>
              <ul>
                <li>Ispričajte najveću grešku koju ste napravili na poslu.</li>
                <li>Kako ste rešili tu situaciju?</li>
                <li>Šta ste naučili iz toga?</li>
              </ul>
              <p className="text-danger mt-2"><strong>Crvene zastavice:</strong> "Nikada nisam pogrešio", Krivica je kod drugih, Izbegava odgovor, Nema pouku.</p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s2_ownership', 'Ownership')}
              {renderStars('r2_s2_odgovornost', 'Odgovornost')}
              {renderStars('r2_s2_iskrenost', 'Iskrenost')}
              {renderStars('r2_s2_zrelost', 'Profesionalna zrelost')}
              {renderStars('r2_s2_ucenje', 'Sposobnost učenja')}
            </div>
            <div className="input-group">
              <label>Beleške *</label>
              <textarea rows={3} value={notes.r2_s2 || ''} onChange={e => handleNote('r2_s2', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s2 || ''} onChange={e => handleFlag('r2_s2', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>PROBLEM SA ŠTAMPAROM (15 min)</h3>
              <p><strong>Intervjuer glumi klijenta:</strong> <em>"Ćao, ovde Marko. Samo proveravam. Događaj nam je za dva dana. Da li je sve spremno?"</em></p>
              <p><strong>Dodatna info za kandidata:</strong> Štampar ne odgovara. Postoji ozbiljan rizik da roba zakasni.</p>
              <p className="text-danger mt-2"><strong>Crvene zastavice:</strong> Kriv je štampar, Prazna obećanja, Nema plan B, Paniči.</p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s3_ownership', 'Ownership')}
              {renderStars('r2_s3_komunikacija', 'Komunikacija')}
              {renderStars('r2_s3_empatija', 'Empatija')}
              {renderStars('r2_s3_stabilnost', 'Stabilnost')}
              {renderStars('r2_s3_resavanje', 'Rešavanje problema')}
              {renderStars('r2_s3_ocekivanja', 'Upravljanje očekivanjima')}
            </div>
            <div className="input-group">
              <label>Beleške (da li smiruje klijenta, predlaže rešenje, plan B) *</label>
              <textarea rows={3} value={notes.r2_s3 || ''} onChange={e => handleNote('r2_s3', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s3 || ''} onChange={e => handleFlag('r2_s3', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>HLADNI POZIV – SEKRETARICA (7 min)</h3>
              <p><strong>Intervjuer glumi sekretaricu:</strong> Direktor nije tu / Pošaljite na info@ / Imamo dobavljača / Nismo zainteresovani.</p>
              <p><strong>Cilj kandidata:</strong> Pokušaj da dođe do osobe koja donosi odluku.</p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s4_upornost', 'Upornost')}
              {renderStars('r2_s4_energija', 'Energija')}
              {renderStars('r2_s4_komunikacija', 'Komunikacija')}
              {renderStars('r2_s4_snalazljivost', 'Snalažljivost')}
              {renderStars('r2_s4_profesionalnost', 'Profesionalnost')}
            </div>
            <div className="input-group">
              <label>Beleške *</label>
              <textarea rows={3} value={notes.r2_s4 || ''} onChange={e => handleNote('r2_s4', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s4 || ''} onChange={e => handleFlag('r2_s4', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>HLADNI POZIV – DIREKTOR MARKETINGA (7 min)</h3>
              <p><strong>Intervjuer glumi direktora:</strong> <em>"Čuo sam za vas, ali već tri godine radimo sa postojećim dobavljačem i nemamo razlog da menjamo saradnju."</em></p>
              <p className="text-danger mt-2"><strong>Crvene zastavice:</strong> Odmah nudi popust, Priča više nego što sluša, Ne istražuje potrebe.</p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s5_prodajni', 'Prodajni potencijal')}
              {renderStars('r2_s5_slusanje', 'Aktivno slušanje')}
              {renderStars('r2_s5_pitanja', 'Postavljanje pitanja')}
              {renderStars('r2_s5_vodjenje', 'Vođenje razgovora')}
              {renderStars('r2_s5_zakljucivanje', 'Zaključivanje')}
            </div>
            <div className="input-group">
              <label>Beleške (da li pokušava da zakaže sastanak) *</label>
              <textarea rows={3} value={notes.r2_s5 || ''} onChange={e => handleNote('r2_s5', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s5 || ''} onChange={e => handleFlag('r2_s5', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>TEST PRIORITIZACIJE (15 min)</h3>
              <p><strong>Scenario (08:00 ujutru):</strong> 2 hitne ponude, vozač čeka robu, direktor traži izveštaj, problem sa dobavljačem, klijent čeka odgovor, 3 nova upita.</p>
              <p><strong>Zadatak:</strong> "Napišite šta radite narednih 30 minuta i objasnite zašto."</p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s6_organizacija', 'Organizacija')}
              {renderStars('r2_s6_logika', 'Logika')}
              {renderStars('r2_s6_prioritizacija', 'Prioritizacija')}
              {renderStars('r2_s6_ownership', 'Ownership')}
              {renderStars('r2_s6_stabilnost', 'Stabilnost pod pritiskom')}
            </div>
            <div className="input-group">
              <label>Beleške *</label>
              <textarea rows={3} value={notes.r2_s6 || ''} onChange={e => handleNote('r2_s6', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s6 || ''} onChange={e => handleFlag('r2_s6', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>POKLON PROJEKAT (15 min)</h3>
              <p>Dati katalog kandidatu. <strong>Klijent:</strong> 120 zaposlenih, Budžet 25 EUR/osobi, Novogodišnji pokloni.</p>
              <p><strong>Zadatak:</strong> Za 15 minuta napraviti predlog i prezentovati ga.</p>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s7_logika', 'Poslovna logika')}
              {renderStars('r2_s7_kreativnost', 'Kreativnost')}
              {renderStars('r2_s7_potrebe', 'Fokus na potrebe klijenta')}
              {renderStars('r2_s7_prezentacija', 'Prezentacija')}
              {renderStars('r2_s7_komercijalno', 'Komercijalno razmišljanje')}
            </div>
            <div className="input-group">
              <label>Beleške *</label>
              <textarea rows={3} value={notes.r2_s7 || ''} onChange={e => handleNote('r2_s7', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s7 || ''} onChange={e => handleFlag('r2_s7', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="step-content">
            <div className="instruction-box">
              <h3>USLOVI I MOTIVACIJA (10 min)</h3>
              <h4>PITANJA:</h4>
              <ul>
                <li>Šta vas najviše motiviše u prodaji?</li>
                <li>Šta očekujete od poslodavca?</li>
                <li>Kako gledate na sistem bonusa i nagrađivanja?</li>
              </ul>
            </div>
            <div className="ratings-grid">
              {renderStars('r2_s8_motivacija', 'Motivacija')}
              {renderStars('r2_s8_ambicija', 'Ambicija')}
              {renderStars('r2_s8_proaktivnost', 'Proaktivnost')}
              {renderStars('r2_s8_ucenje', 'Želja za učenjem')}
            </div>
            <div className="input-group">
              <label>Beleške *</label>
              <textarea rows={3} value={notes.r2_s8 || ''} onChange={e => handleNote('r2_s8', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="text-danger">Crvene zastavice</label>
              <textarea rows={2} value={redFlags.r2_s8 || ''} onChange={e => handleFlag('r2_s8', e.target.value)} />
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="step-content">
            <div className="instruction-box" style={{ background: '#f8fafc', borderLeftColor: '#3b82f6' }}>
              <h3>ZAVRŠNA PROCENA - OBAVEZNA PITANJA</h3>
              
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Da li biste ovom kandidatu poverili svog najvećeg klijenta?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className={`btn-secondary ${notes.r2_final_najveci_klijent === 'DA' ? 'selected-da' : ''}`} style={notes.r2_final_najveci_klijent === 'DA' ? {background: '#10b981', color: 'white'} : {}} onClick={() => handleNote('r2_final_najveci_klijent', 'DA')}>DA</button>
                  <button className={`btn-secondary ${notes.r2_final_najveci_klijent === 'NE' ? 'selected-ne' : ''}`} style={notes.r2_final_najveci_klijent === 'NE' ? {background: '#ef4444', color: 'white'} : {}} onClick={() => handleNote('r2_final_najveci_klijent', 'NE')}>NE</button>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Da li biste ovog kandidata zaposlili da danas morate da donesete odluku?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className={`btn-secondary ${notes.r2_final_zaposlio_danas === 'DA' ? 'selected-da' : ''}`} style={notes.r2_final_zaposlio_danas === 'DA' ? {background: '#10b981', color: 'white'} : {}} onClick={() => handleNote('r2_final_zaposlio_danas', 'DA')}>DA</button>
                  <button className={`btn-secondary ${notes.r2_final_zaposlio_danas === 'NE' ? 'selected-ne' : ''}`} style={notes.r2_final_zaposlio_danas === 'NE' ? {background: '#ef4444', color: 'white'} : {}} onClick={() => handleNote('r2_final_zaposlio_danas', 'NE')}>NE</button>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Najveće prednosti kandidata *</label>
              <textarea rows={3} value={notes.r2_final_prednosti || ''} onChange={e => handleNote('r2_final_prednosti', e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Najveći rizici kandidata *</label>
              <textarea rows={3} value={notes.r2_final_rizici || ''} onChange={e => handleNote('r2_final_rizici', e.target.value)} />
            </div>

            <div className="input-group">
              <label>Potencijal za razvoj *</label>
              <textarea rows={2} value={notes.r2_final_potencijal || ''} onChange={e => handleNote('r2_final_potencijal', e.target.value)} />
            </div>

            <div className="input-group">
              <label>Procena uklapanja u Zeppelin Pro *</label>
              <textarea rows={2} value={notes.r2_final_kultura || ''} onChange={e => handleNote('r2_final_kultura', e.target.value)} />
            </div>
            
            <div className="input-group">
              <label className="text-danger">Konačne Crvene Zastavice</label>
              <textarea rows={2} value={redFlags.r2_final_zastavice || ''} onChange={e => handleFlag('r2_final_zastavice', e.target.value)} />
            </div>

            <div className="input-group">
              <label>Konačna Preporuka *</label>
              <div className="recommendation-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  className={`btn-secondary ${recommendation === 'IDE NA PROBNI RAD' ? 'selected-da' : ''}`} 
                  style={recommendation === 'IDE NA PROBNI RAD' ? {background: '#10b981', color: 'white'} : {}}
                  onClick={() => setRecommendation('IDE NA PROBNI RAD')}>
                  ✅ IDE NA PROBNI RAD
                </button>
                <button 
                  className={`btn-secondary ${recommendation === 'POTREBAN DODATNI RAZGOVOR' ? 'selected-mozda' : ''}`} 
                  style={recommendation === 'POTREBAN DODATNI RAZGOVOR' ? {background: '#f59e0b', color: 'white'} : {}}
                  onClick={() => setRecommendation('POTREBAN DODATNI RAZGOVOR')}>
                  ⚠️ POTREBAN DODATNI RAZGOVOR
                </button>
                <button 
                  className={`btn-secondary ${recommendation === 'ODBITI KANDIDATA' ? 'selected-ne' : ''}`} 
                  style={recommendation === 'ODBITI KANDIDATA' ? {background: '#ef4444', color: 'white'} : {}}
                  onClick={() => setRecommendation('ODBITI KANDIDATA')}>
                  ❌ ODBITI KANDIDATA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        {currentStep > 1 ? (
          <button className="btn-secondary" onClick={() => {
            saveCurrentProgress();
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
          }}>
            <ChevronLeft size={18} /> Nazad
          </button>
        ) : <div></div>}
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isSaved && <span className="save-indicator"><CheckCircle size={16} /> Sačuvano</span>}
          <button className="btn-secondary" onClick={() => {
            saveCurrentProgress();
          }}>
            <Save size={18} /> Sačuvaj
          </button>
          
          {currentStep < 9 ? (
            <button className="btn-primary" onClick={nextStep}>
              Sledeći korak <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn-primary" onClick={() => {
              if (validateStep()) {
                saveCurrentProgress();
                alert('Završna procena je uspešno sačuvana!');
              }
            }}>
              Završi procenu <CheckCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
