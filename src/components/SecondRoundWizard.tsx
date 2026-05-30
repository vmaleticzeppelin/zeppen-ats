import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Shield, CheckCircle, AlertTriangle, Star
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useEvaluations } from '../context/EvaluationContext';
import { useCandidates } from '../context/CandidateContext';
import './FirstRoundWizard.css'; // Recikliramo stilove

const STEPS = [
  "Uvod",
  "1. Analiza iskustva",
  "2. Simulacija prodaje",
  "3. Organizacija",
  "4. Email test",
  "5. Težak klijent",
  "6. Poklon projekat",
  "7. Završna Procena"
];

interface SecondRoundWizardProps {
  candidateId: string | number;
}

const SecondRoundWizard: React.FC<SecondRoundWizardProps> = ({ candidateId }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { saveEvaluation, getEvaluation } = useEvaluations();
  const { updateCandidate } = useCandidates();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [redFlags, setRedFlags] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<string | null>(null);

  // Učitaj prethodne podatke kada se promeni korisnik
  useEffect(() => {
    if (currentUser === 'Branislav' || currentUser === 'Dusan' || currentUser === 'Admin') {
      const existing = getEvaluation(String(candidateId), currentUser, 2);
      if (existing) {
        setScores(existing.scores || {});
        setNotes(existing.notes || {});
        setRedFlags(existing.redFlags || {});
        setRecommendation(existing.recommendation || null);
      }
    }
  }, [currentUser, candidateId]);

  const handleScore = (key: string, val: number) => setScores({ ...scores, [key]: val });
  const handleNote = (key: string, val: string) => setNotes({ ...notes, [key]: val });
  const handleRedFlag = (key: string, val: string) => setRedFlags({ ...redFlags, [key]: val });

  const validateStep = (currentStep: number): boolean => {
    if (currentUser === 'Admin') return true;

    const reqScores = (keys: string[]) => keys.every(k => scores[k]);
    const reqNotes = (keys: string[]) => keys.every(k => notes[k] && notes[k].trim() !== '');

    switch (currentStep) {
      case 1:
        return reqScores(['r2_s1_ownership', 'r2_s1_odgovornost', 'r2_s1_samopouzdanje', 'r2_s1_zrelost', 'r2_s1_kvalitet']) && reqNotes(['r2_s1']);
      case 2:
        return reqScores(['r2_s2_kontakt', 'r2_s2_pitanja', 'r2_s2_slusanje', 'r2_s2_energija', 'r2_s2_sigurnost', 'r2_s2_vodjenje', 'r2_s2_prodaja', 'r2_s2_zakljucivanje']) && reqNotes(['r2_s2']);
      case 3:
        return reqScores(['r2_s3_organizacija', 'r2_s3_prioritizacija', 'r2_s3_logika', 'r2_s3_ownership', 'r2_s3_stabilnost']) && reqNotes(['r2_s3']);
      case 4:
        return reqScores(['r2_s4_profesionalnost', 'r2_s4_struktura', 'r2_s4_pravopis', 'r2_s4_jasnoca', 'r2_s4_inicijativa']) && reqNotes(['r2_s4']);
      case 5:
        return reqScores(['r2_s5_stabilnost', 'r2_s5_empatija', 'r2_s5_komunikacija', 'r2_s5_pregovaranje', 'r2_s5_konflikt']) && reqNotes(['r2_s5']);
      case 6:
        return reqScores(['r2_s6_potrebe', 'r2_s6_kreativnost', 'r2_s6_poslovna_logika', 'r2_s6_prezentacija', 'r2_s6_budzet']) && reqNotes(['r2_s6']);
      case 7:
        if (!recommendation) return false;
        return reqNotes(['r2_final_prednosti', 'r2_final_rizici', 'r2_final_potencijal', 'r2_final_kultura']) &&
               reqScores(['r2_final_org', 'r2_final_prodaja', 'r2_final_ownership', 'r2_final_kom', 'r2_final_stab', 'r2_final_pisana', 'r2_final_kultura']);
      default:
        return true; 
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      alert("Molimo vas da popunite sva obavezna polja i ocenite sve stavke pre prelaska na sledeći korak.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 7));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const generateSimpleAI = () => {
    const radar = calculateRadarData();
    let text = "AUTOMATSKA ANALIZA KANDIDATA:\n\n";
    radar.forEach(cat => {
      text += `- ${cat.subject}: `;
      if (cat.A >= 80) text += "Veoma izraženo, jak potencijal.\n";
      else if (cat.A >= 60) text += "Prosečno, zadovoljava osnovne kriterijume.\n";
      else text += "Slabo, potrebna je obuka ili predstavlja rizik.\n";
    });
    
    if (totalScore >= 75) text += "\nPREPORUKA: DA - IDE NA PROBNI RAD";
    else if (totalScore >= 60) text += "\nPREPORUKA: MOŽDA - DODATNI RAZGOVOR";
    else text += "\nPREPORUKA: NE - ODBITI";
    
    return text;
  };

  const handleSaveAll = async () => {
    if (!validateStep(7)) {
      alert("Molimo vas da popunite sva tekstualna polja i finalnu preporuku pre čuvanja.");
      return;
    }
    if (currentUser === 'Branislav' || currentUser === 'Dusan' || currentUser === 'Admin') {
      const generatedAI = generateSimpleAI();
      const updatedNotes = { ...notes, ai_analiza: generatedAI };

      await saveEvaluation(String(candidateId), currentUser, { scores, notes: updatedNotes, redFlags, recommendation }, 2);
      
      await updateCandidate(candidateId, { status: 'Završena selekcija' });
      alert('Procena za drugi krug uspešno sačuvana!');
      navigate('/candidates');
    }
  };

  const calculateRadarData = () => {
    const getAvg = (keys: string[]) => {
      let sum = 0;
      let count = 0;
      keys.forEach(k => {
        if (scores[k]) { sum += scores[k]; count++; }
      });
      return count === 0 ? 0 : Math.round((sum / count) * 20); // Scale to 100
    };

    return [
      { subject: 'Organizacija', A: getAvg(['r2_s3_organizacija', 'r2_s3_prioritizacija', 'r2_final_org']), fullMark: 100 },
      { subject: 'Prodaja', A: getAvg(['r2_s2_prodaja', 'r2_s2_zakljucivanje', 'r2_final_prodaja', 'r2_s5_pregovaranje']), fullMark: 100 },
      { subject: 'Ownership', A: getAvg(['r2_s1_ownership', 'r2_s3_ownership', 'r2_final_ownership', 'r2_s1_odgovornost']), fullMark: 100 },
      { subject: 'Komunikacija', A: getAvg(['r2_s2_vodjenje', 'r2_s5_komunikacija', 'r2_final_kom', 'r2_s6_prezentacija']), fullMark: 100 },
      { subject: 'Stabilnost', A: getAvg(['r2_s3_stabilnost', 'r2_s5_stabilnost', 'r2_s5_konflikt', 'r2_final_stab']), fullMark: 100 },
      { subject: 'Uklapanje (Kultura)', A: getAvg(['r2_s1_zrelost', 'r2_s6_kreativnost', 'r2_final_kultura']), fullMark: 100 },
    ];
  };

  const radarData = calculateRadarData();
  const totalScore = Math.round(radarData.reduce((acc, curr) => acc + curr.A, 0) / radarData.length) || 0;

  return (
    <div className="wizard-container">
      {/* Wizard Header / Progress */}
      <div className="wizard-progress" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
        {STEPS.map((s, idx) => (
          <div key={idx} className={`progress-step ${step === idx ? 'active' : step > idx ? 'completed' : ''}`}>
            <div className="step-circle">{idx === 0 ? 'Intro' : idx}</div>
            <span className="step-label" style={{ fontSize: '0.75rem' }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="wizard-content card">
        
        {/* STEP 0: UVOD */}
        {step === 0 && (
          <div className="step-panel intro-panel">
            <h2><Shield size={28} className="icon-warning" /> DRUGI KRUG SELEKCIJE</h2>
            <div className="intro-text">
              <p>Ovo nije klasičan intervju, već praktična procena kandidata (60–90 minuta).</p>
              
              <div className="tags-grid" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                <span>Kako razmišlja</span><span>Kako organizuje posao</span><span>Kako komunicira</span>
                <span>Kako prodaje</span><span>Kako rešava probleme</span><span>Kako funkcioniše pod pritiskom</span>
                <span>Ownership mindset</span><span>Kultura kompanije</span>
              </div>
              
              <div className="observe-box">
                <h4>Uloge tokom intervjua:</h4>
                <p>Intervju vode <strong>Branislav i Dušan</strong>.</p>
                <ul style={{ marginTop: '0.5rem' }}>
                  <li><strong>Osoba 1:</strong> Vodi razgovor, postavlja pitanja i vodi simulacije.</li>
                  <li><strong>Osoba 2:</strong> Prati ponašanje, beleži zapažanja, ocenjuje odgovore, prati govor tela i energiju.</li>
                </ul>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed var(--color-text-muted)', textAlign: 'center' }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>🖨️ Offline Ocenjivanje (Drugi Krug)</h4>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Odštampajte ovaj obrazac ako vam je lakše da beležite ručno tokom simulacija.</p>
                <button className="btn-secondary" onClick={() => window.open('/print/second-round', '_blank')} style={{ fontWeight: 'bold' }}>
                  Preuzmi / Štampaj PDF Obrazac
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: ISKUSTVO */}
        {step === 1 && (
          <div className="step-panel">
            <h2>KORAK 1 — Dublja analiza dosadašnjeg iskustva (10 min)</h2>
            <div className="question-highlight">
              <strong>PITANJA:</strong>
              <ul>
                <li>"Koji je vaš najveći profesionalni uspeh?"</li>
                <li>"Na šta ste najponosniji u dosadašnjoj karijeri?"</li>
                <li>"Šta biste danas uradili drugačije u prethodnoj firmi?"</li>
                <li>"Zašto mislite da ste bili uspešni?"</li>
              </ul>
            </div>
            
            <div className="instruction-box">
              <strong>Cilj:</strong> Utvrditi nivo ownership-a, odgovornosti i realnog iskustva.<br/>
              <strong>Obratiti pažnju na:</strong> ownership mindset, preuzimanje odgovornosti, nivo samopouzdanja, iskrenost.<br/>
              <strong className="text-danger">Crvene zastavice:</strong> stalno krivi druge/bivše firme, nema konkretne rezultate, preuzima zasluge za tuđ rad.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Ownership" id="r2_s1_ownership" score={scores.r2_s1_ownership} onScore={handleScore} />
              <RatingRow label="Odgovornost" id="r2_s1_odgovornost" score={scores.r2_s1_odgovornost} onScore={handleScore} />
              <RatingRow label="Samopouzdanje" id="r2_s1_samopouzdanje" score={scores.r2_s1_samopouzdanje} onScore={handleScore} />
              <RatingRow label="Profesionalna zrelost" id="r2_s1_zrelost" score={scores.r2_s1_zrelost} onScore={handleScore} />
              <RatingRow label="Kvalitet iskustva" id="r2_s1_kvalitet" score={scores.r2_s1_kvalitet} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="r2_s1" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 2: SIMULACIJA PRODAJNOG SASTANKA */}
        {step === 2 && (
          <div className="step-panel">
            <h2>KORAK 2 — Simulacija prodajnog sastanka (20 min)</h2>
            <div className="script-box highlight">
              <span className="badge badge-primary">SCENARIO:</span>
              <p>Intervjuer glumi direktora firme od 50 zaposlenih koji traži ideje za poslovne poklone za zaposlene. Kandidatu dati <strong>3 minuta pripreme</strong>.</p>
              <p><strong>Zadatak:</strong> "Prodajte mi sastanak."</p>
              <p className="text-danger" style={{ fontWeight: 'bold' }}>VAŽNO: Kandidat NE SME odmah nuditi proizvode! Treba da upozna potrebe, postavlja pitanja i vodi razgovor.</p>
            </div>
            
            <div className="instruction-box mt-3">
              <strong>Posmatrati:</strong> Da li postavlja pitanja, sluša, vodi razgovor, pokušava da razume potrebe, deluje kao savetnik.<br/>
              <strong className="text-danger">Crvene zastavice:</strong> Odmah nudi proizvode, priča više nego što sluša, ne postavlja pitanja, nema strukturu.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Uspostavljanje kontakta" id="r2_s2_kontakt" score={scores.r2_s2_kontakt} onScore={handleScore} />
              <RatingRow label="Postavljanje pitanja" id="r2_s2_pitanja" score={scores.r2_s2_pitanja} onScore={handleScore} />
              <RatingRow label="Aktivno slušanje" id="r2_s2_slusanje" score={scores.r2_s2_slusanje} onScore={handleScore} />
              <RatingRow label="Energija" id="r2_s2_energija" score={scores.r2_s2_energija} onScore={handleScore} />
              <RatingRow label="Sigurnost" id="r2_s2_sigurnost" score={scores.r2_s2_sigurnost} onScore={handleScore} />
              <RatingRow label="Vođenje razgovora" id="r2_s2_vodjenje" score={scores.r2_s2_vodjenje} onScore={handleScore} />
              <RatingRow label="Prodajni potencijal" id="r2_s2_prodaja" score={scores.r2_s2_prodaja} onScore={handleScore} />
              <RatingRow label="Zaključivanje razgovora" id="r2_s2_zakljucivanje" score={scores.r2_s2_zakljucivanje} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="r2_s2" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 3: ORGANIZACIJA */}
        {step === 3 && (
          <div className="step-panel">
            <h2>KORAK 3 — Test organizacije i prioritizacije (15 min)</h2>
            <div className="script-box">
              <span className="badge badge-warning">SCENARIO - 08:00 ujutru:</span>
              <p>Imate:</p>
              <ul>
                <li>2 hitne ponude</li>
                <li>direktor traži izveštaj</li>
                <li>dobavljač javlja problem</li>
                <li>klijent čeka odgovor</li>
                <li>vozač čeka robu</li>
                <li>stigla su 3 nova upita</li>
              </ul>
              <p><strong>PITANJE:</strong> "Napišite redosled kojim biste rešavali situaciju." Nakon toga: "Objasnite zašto."</p>
            </div>
            
            <div className="instruction-box mt-3">
              <strong>Posmatrati:</strong> logiku, prioritizaciju, ownership, sposobnost donošenja odluka, organizaciju.<br/>
              <strong className="text-danger">Crvene zastavice:</strong> radi sve redom bez prioriteta, paniči, ne vidi kritične tačke.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Organizacija" id="r2_s3_organizacija" score={scores.r2_s3_organizacija} onScore={handleScore} />
              <RatingRow label="Prioritizacija" id="r2_s3_prioritizacija" score={scores.r2_s3_prioritizacija} onScore={handleScore} />
              <RatingRow label="Logika" id="r2_s3_logika" score={scores.r2_s3_logika} onScore={handleScore} />
              <RatingRow label="Ownership" id="r2_s3_ownership" score={scores.r2_s3_ownership} onScore={handleScore} />
              <RatingRow label="Stabilnost pod pritiskom" id="r2_s3_stabilnost" score={scores.r2_s3_stabilnost} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="r2_s3" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 4: EMAIL TEST */}
        {step === 4 && (
          <div className="step-panel">
            <h2>KORAK 4 — Email Test (15 min)</h2>
            <div className="script-box">
              <span className="badge badge-warning">SCENARIO:</span>
              <p>Klijent traži: 300 rokovnika sa logotipom. Događaj je za 10 dana.</p>
              <p><strong>ZADATAK:</strong> Kandidat treba da napiše email klijentu (na licu mesta).</p>
            </div>
            
            <div className="instruction-box mt-3">
              <strong>Posmatrati:</strong> pravopis, jasnoću, strukturu, profesionalnost, inicijativu.<br/>
              <strong className="text-danger">Crvene zastavice:</strong> nepismenost, konfuzna komunikacija, neprofesionalan ton, ne traži dodatne informacije.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Profesionalna komunikacija" id="r2_s4_profesionalnost" score={scores.r2_s4_profesionalnost} onScore={handleScore} />
              <RatingRow label="Struktura emaila" id="r2_s4_struktura" score={scores.r2_s4_struktura} onScore={handleScore} />
              <RatingRow label="Pravopis" id="r2_s4_pravopis" score={scores.r2_s4_pravopis} onScore={handleScore} />
              <RatingRow label="Jasnoća" id="r2_s4_jasnoca" score={scores.r2_s4_jasnoca} onScore={handleScore} />
              <RatingRow label="Inicijativa" id="r2_s4_inicijativa" score={scores.r2_s4_inicijativa} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="r2_s4" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 5: TEŽAK KLIJENT */}
        {step === 5 && (
          <div className="step-panel">
            <h2>KORAK 5 — Težak klijent (15 min)</h2>
            <div className="script-box">
              <span className="badge badge-danger">SCENARIJA (Intervjuer bira jedan):</span>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>1. "Konkurencija mi je dala nižu cenu."</li>
                <li>2. "Kasnite sa ponudom."</li>
                <li>3. "Nisam zadovoljan vašom uslugom."</li>
              </ul>
            </div>
            
            <div className="instruction-box mt-3">
              <strong>Posmatrati:</strong> smirenost, kontrolu emocija, komunikaciju, pregovaračke sposobnosti, empatiju, rešavanje konflikta.<br/>
              <strong className="text-danger">Crvene zastavice:</strong> ulazi u raspravu, postaje defanzivan, spušta cenu bez razmišljanja, gubi kontrolu razgovora.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Stabilnost" id="r2_s5_stabilnost" score={scores.r2_s5_stabilnost} onScore={handleScore} />
              <RatingRow label="Empatija" id="r2_s5_empatija" score={scores.r2_s5_empatija} onScore={handleScore} />
              <RatingRow label="Komunikacija" id="r2_s5_komunikacija" score={scores.r2_s5_komunikacija} onScore={handleScore} />
              <RatingRow label="Pregovaranje" id="r2_s5_pregovaranje" score={scores.r2_s5_pregovaranje} onScore={handleScore} />
              <RatingRow label="Rešavanje konflikta" id="r2_s5_konflikt" score={scores.r2_s5_konflikt} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="r2_s5" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 6: POKLON PROJEKAT */}
        {step === 6 && (
          <div className="step-panel">
            <h2>KORAK 6 — Poklon Projekat (15 min)</h2>
            <div className="script-box">
              <span className="badge badge-success">SCENARIO (Dati kandidatu katalog):</span>
              <p>Klijent ima 100 zaposlenih. Budžet: 25 EUR po osobi. Traži novogodišnje poklone.</p>
              <p><strong>ZADATAK:</strong> Za 15 minuta napraviti predlog. Nakon toga prezentovati rešenje.</p>
            </div>
            
            <div className="instruction-box mt-3">
              <strong>Posmatrati:</strong> kreativnost, poslovno razmišljanje, prezentaciju, logiku izbora proizvoda, fokus na potrebe klijenta.<br/>
              <strong className="text-danger">Crvene zastavice:</strong> bira proizvode bez logike, ne vodi računa o budžetu, nema strukturu prezentacije.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Razumevanje potreba klijenta" id="r2_s6_potrebe" score={scores.r2_s6_potrebe} onScore={handleScore} />
              <RatingRow label="Kreativnost" id="r2_s6_kreativnost" score={scores.r2_s6_kreativnost} onScore={handleScore} />
              <RatingRow label="Poslovna logika" id="r2_s6_poslovna_logika" score={scores.r2_s6_poslovna_logika} onScore={handleScore} />
              <RatingRow label="Prezentacione veštine" id="r2_s6_prezentacija" score={scores.r2_s6_prezentacija} onScore={handleScore} />
              <RatingRow label="Fokus na budžet" id="r2_s6_budzet" score={scores.r2_s6_budzet} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="r2_s6" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 7: FINALNA PROCENA */}
        {step === 7 && (
          <div className="step-panel">
            <h2>KORAK 7 — Završna Procena Drugog Kruga</h2>
            
            <div className="ratings-grid" style={{ marginBottom: '1.5rem', background: 'var(--color-bg-alt)', padding: '1rem', borderRadius: '8px' }}>
              <h3 style={{ gridColumn: '1 / -1', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Sveukupne ocene 1-5</h3>
              <RatingRow label="Organizacija" id="r2_final_org" score={scores.r2_final_org} onScore={handleScore} />
              <RatingRow label="Prodajni potencijal" id="r2_final_prodaja" score={scores.r2_final_prodaja} onScore={handleScore} />
              <RatingRow label="Ownership" id="r2_final_ownership" score={scores.r2_final_ownership} onScore={handleScore} />
              <RatingRow label="Komunikacija" id="r2_final_kom" score={scores.r2_final_kom} onScore={handleScore} />
              <RatingRow label="Stabilnost" id="r2_final_stab" score={scores.r2_final_stab} onScore={handleScore} />
              <RatingRow label="Pisana komunikacija" id="r2_final_pisana" score={scores.r2_final_pisana} onScore={handleScore} />
              <RatingRow label="Kultura uklapanja" id="r2_final_kultura" score={scores.r2_final_kultura} onScore={handleScore} />
            </div>

            <div className="final-grid">
              {/* Leva kolona: Polja za unos */}
              <div className="final-inputs">
                <div className="form-group">
                  <label>Najveće prednosti kandidata</label>
                  <textarea className="text-input" rows={2} value={notes.r2_final_prednosti || ''} onChange={e => handleNote('r2_final_prednosti', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Najveći rizici</label>
                  <textarea className="text-input" rows={2} value={notes.r2_final_rizici || ''} onChange={e => handleNote('r2_final_rizici', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="text-danger">Crvene zastavice</label>
                  <textarea className="text-input danger-input" rows={2} value={redFlags.r2_final_zastavice || ''} onChange={e => handleRedFlag('r2_final_zastavice', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Potencijal za razvoj</label>
                  <textarea className="text-input" rows={2} value={notes.r2_final_potencijal || ''} onChange={e => handleNote('r2_final_potencijal', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Procena uklapanja u Zeppelin Pro</label>
                  <textarea className="text-input" rows={2} value={notes.r2_final_kultura || ''} onChange={e => handleNote('r2_final_kultura', e.target.value)} />
                </div>
                
                <div className="recommendation-box" style={{ marginTop: '1.5rem' }}>
                  <label style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}>Preporuka</label>
                  <select 
                    value={recommendation || ''} 
                    onChange={e => setRecommendation(e.target.value)} 
                    className="text-input"
                    style={{ fontSize: '1.1rem', padding: '0.75rem', fontWeight: 'bold' }}
                  >
                    <option value="">Izaberite preporuku...</option>
                    <option value="DA - IDE NA PROBNI RAD">DA - IDE NA PROBNI RAD</option>
                    <option value="MOŽDA - DODATNI RAZGOVOR">MOŽDA - DODATNI RAZGOVOR</option>
                    <option value="NE - ODBITI">NE - ODBITI</option>
                  </select>
                </div>
              </div>

              {/* Desna kolona: Automatski Score & Radar */}
              <div className="final-stats">
                <div className="total-score-box">
                  <span className="ts-label">Ukupan Score (Krug 2)</span>
                  <span className="ts-value">{totalScore}%</span>
                  <span className="ts-sub">Kompatibilnost</span>
                </div>
                
                <div className="radar-wrapper">
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#383D47" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A5B1', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Kandidat" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="score-breakdown">
                  {radarData.map(item => (
                    <div key={item.subject} className="sb-row">
                      <span>{item.subject}</span>
                      <strong>{item.A}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="wizard-footer">
        <button className="btn-secondary" onClick={prevStep} disabled={step === 0}>
          <ChevronLeft size={18} /> Prethodni Korak
        </button>
        {step < 7 ? (
          <button className="btn-primary" onClick={nextStep}>
            {step === 0 ? "Pređi na simulacije" : "Sledeći Korak"} <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-primary success-btn" onClick={handleSaveAll}>
            Završi i Sačuvaj Procenu <CheckCircle size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// Pomoćne komponente
const RatingRow = ({ label, id, score = 0, onScore }: { label: string, id: string, score?: number, onScore: (k:string, v:number) => void }) => {
  return (
    <div className="rating-row-wiz">
      <div className="rating-label">{label}</div>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(num => (
          <button 
            key={num} 
            className={`star-btn ${score >= num ? 'active' : ''}`}
            onClick={() => onScore(id, num)}
          >
            <Star size={24} fill={score >= num ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    </div>
  );
};

const NotesAndFlags = ({ stepId, notes, redFlags, onNote, onFlag }: any) => {
  return (
    <div className="notes-grid">
      <div className="form-group">
        <label>Beleške i zapažanja</label>
        <textarea 
          className="text-input" 
          rows={3} 
          value={notes[stepId] || ''} 
          onChange={e => onNote(stepId, e.target.value)} 
          placeholder="Unesite beleške..." 
        />
      </div>
      <div className="form-group">
        <label className="text-danger"><AlertTriangle size={14}/> Crvene zastavice</label>
        <textarea 
          className="text-input danger-input" 
          rows={3} 
          value={redFlags[stepId] || ''} 
          onChange={e => onFlag(stepId, e.target.value)} 
          placeholder="Ako ste primetili crvene zastavice..." 
        />
      </div>
    </div>
  );
};

export default SecondRoundWizard;
