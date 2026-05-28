import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Shield, CheckCircle, AlertTriangle, Star, 
  MessageSquare, Clock, Target, Briefcase, Info, XCircle
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useEvaluations } from '../context/EvaluationContext';
import { useCandidates } from '../context/CandidateContext';
import AdminFirstRoundView from './AdminFirstRoundView';
import './FirstRoundWizard.css';
import './AdminFirstRoundView.css';

const STEPS = [
  "Uvod",
  "1. Dolazak",
  "2. Uvodni razgovor",
  "3. O kandidatu",
  "4. Motivacija",
  "5. Komunikacija",
  "6. Organizacija",
  "7. Pritisak",
  "8. CRM",
  "9. Scenario",
  "10. Finalna Procena"
];

interface FirstRoundWizardProps {
  candidateId: string | number;
}

const FirstRoundWizard: React.FC<FirstRoundWizardProps> = ({ candidateId }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { saveEvaluation, getEvaluation } = useEvaluations();
  const { updateCandidate } = useCandidates();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [redFlags, setRedFlags] = useState<Record<string, string>>({});
  const [arrivedOnTime, setArrivedOnTime] = useState<boolean | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);

  // Učitaj prethodne podatke kada se promeni korisnik
  useEffect(() => {
    if (currentUser === 'Branislav' || currentUser === 'Dusan' || currentUser === 'Admin') {
      const existing = getEvaluation(String(candidateId), currentUser);
      if (existing) {
        setScores(existing.scores || {});
        setNotes(existing.notes || {});
        setRedFlags(existing.redFlags || {});
        setRecommendation(existing.recommendation || null);
        if (existing.notes?.arrivedOnTime === 'DA') setArrivedOnTime(true);
        else if (existing.notes?.arrivedOnTime === 'NE') setArrivedOnTime(false);
      }
    }
  }, [currentUser, candidateId]);

  const handleScore = (key: string, val: number) => setScores({ ...scores, [key]: val });
  const handleNote = (key: string, val: string) => setNotes({ ...notes, [key]: val });
  const handleRedFlag = (key: string, val: string) => setRedFlags({ ...redFlags, [key]: val });

  const validateStep = (currentStep: number): boolean => {
    // Ako je Admin, dozvoljavamo prolaz i bez svih polja
    if (currentUser === 'Admin') return true;

    const reqScores = (keys: string[]) => keys.every(k => scores[k]);
    const reqNotes = (keys: string[]) => keys.every(k => notes[k] && notes[k].trim() !== '');

    switch (currentStep) {
      case 1:
        if (arrivedOnTime === null) return false;
        return reqScores(['s1_energija', 's1_kontakt', 's1_sigurnost', 's1_prof', 's1_komunikativnost', 's1_vizuelni']);
      case 3:
        return reqScores(['s3_jasnoca', 's3_struktura', 's3_energija', 's3_sigurnost', 's3_fokus', 's3_prof']);
      case 4:
        return reqScores(['s4_motivacija', 's4_priprema', 's4_ozbiljnost', 's4_energija', 's4_interes']);
      case 5:
        return reqScores(['s5_sigurnost', 's5_telefon', 's5_prodajni', 's5_energija', 's5_prirodnost']);
      case 6:
        return reqScores(['s6_organizacija', 's6_logika', 's6_prioriteti', 's6_stabilnost', 's6_ownership']);
      case 7:
        return reqScores(['s7_stabilnost', 's7_prof', 's7_ownership', 's7_smirenost', 's7_otpornost']);
      case 8:
        return reqScores(['s8_organizovanost', 's8_disciplina', 's8_crm', 's8_sistematicnost', 's8_preciznost']);
      case 9:
        return reqScores(['s9_organizacija', 's9_ownership', 's9_logika', 's9_stabilnost', 's9_resavanje', 's9_komunikacija']);
      case 10:
        if (!recommendation) return false;
        if (!reqNotes(['iskustvo', 'ocekivanaPlata', 'dostupnost'])) return false;
        return reqNotes(['final_prednosti', 'final_rizici', 'final_potencijal', 'final_kultura']);
      default:
        return true; // Koraci 0 i 2 nemaju obavezna polja
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      alert("Molimo vas da popunite sva obavezna polja i ocenite sve stavke pre prelaska na sledeći korak.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 10));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleSaveAll = async () => {
    if (!validateStep(10)) {
      alert("Molimo vas da popunite sva tekstualna polja i finalnu preporuku pre čuvanja.");
      return;
    }
    if (currentUser === 'Branislav' || currentUser === 'Dusan' || currentUser === 'Admin') {
      await saveEvaluation(String(candidateId), currentUser, { scores, notes, redFlags, recommendation });

      // Izračunavanje zajedničkog proseka sa drugim intervjuerom (ako postoji)
      const otherUser = currentUser === 'Branislav' ? 'Dusan' : (currentUser === 'Dusan' ? 'Branislav' : null);
      const otherEval = otherUser ? getEvaluation(String(candidateId), otherUser) : null;

      const calcCombinedAvg = (keys: string[]) => {
        let sum = 0;
        let count = 0;
        keys.forEach(k => {
          if (scores[k]) { sum += scores[k]; count++; }
          if (otherEval?.scores && otherEval.scores[k]) { sum += otherEval.scores[k]; count++; }
        });
        return count === 0 ? 0 : Math.round((sum / count) * 20);
      };

      const combinedRadarData = [
        { subject: 'Energija', A: calcCombinedAvg(['s1_energija', 's3_energija', 's4_energija', 's5_energija']) },
        { subject: 'Komunikacija', A: calcCombinedAvg(['s1_komunikativnost', 's3_jasnoca', 's5_sigurnost', 's5_prirodnost', 's9_komunikacija']) },
        { subject: 'Organizacija', A: calcCombinedAvg(['s6_organizacija', 's8_organizovanost', 's8_sistematicnost', 's9_organizacija']) },
        { subject: 'Stabilnost', A: calcCombinedAvg(['s6_stabilnost', 's7_stabilnost', 's7_smirenost', 's9_stabilnost']) },
        { subject: 'Prodaja & Ownership', A: calcCombinedAvg(['s5_prodajni', 's6_ownership', 's7_ownership', 's9_ownership']) },
        { subject: 'Disciplina (CRM)', A: calcCombinedAvg(['s8_disciplina', 's8_crm', 's8_preciznost']) },
      ];

      const currentTotalScore = Math.round(combinedRadarData.reduce((acc, curr) => acc + curr.A, 0) / combinedRadarData.length) || 0;
      
      await updateCandidate(candidateId, { score: currentTotalScore, status: 'Prvi krug završen' });
      alert('Procena uspešno sačuvana!');
      navigate('/candidates');
    }
  };

  // Calculates data for Radar Chart
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
      { subject: 'Energija', A: getAvg(['s1_energija', 's3_energija', 's4_energija', 's5_energija']), fullMark: 100 },
      { subject: 'Komunikacija', A: getAvg(['s1_komunikativnost', 's3_jasnoca', 's5_sigurnost', 's5_prirodnost', 's9_komunikacija']), fullMark: 100 },
      { subject: 'Organizacija', A: getAvg(['s6_organizacija', 's8_organizovanost', 's8_sistematicnost', 's9_organizacija']), fullMark: 100 },
      { subject: 'Stabilnost', A: getAvg(['s6_stabilnost', 's7_stabilnost', 's7_smirenost', 's9_stabilnost']), fullMark: 100 },
      { subject: 'Prodaja & Ownership', A: getAvg(['s5_prodajni', 's6_ownership', 's7_ownership', 's9_ownership']), fullMark: 100 },
      { subject: 'Disciplina (CRM)', A: getAvg(['s8_disciplina', 's8_crm', 's8_preciznost']), fullMark: 100 },
    ];
  };

  const radarData = calculateRadarData();
  const totalScore = Math.round(radarData.reduce((acc, curr) => acc + curr.A, 0) / radarData.length) || 0;

  return (
    <div className="wizard-container">
      {/* Wizard Header / Progress */}
      <div className="wizard-progress">
        {STEPS.map((s, idx) => (
          <div key={idx} className={`progress-step ${step === idx ? 'active' : step > idx ? 'completed' : ''}`}>
            <div className="step-circle">{idx === 0 ? 'Intro' : idx}</div>
            <span className="step-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="wizard-content card">
        
        {/* STEP 0: UVOD */}
        {step === 0 && (
          <div className="step-panel intro-panel">
            <h2><Shield size={28} className="icon-warning" /> VAŽNO: Edukativna sekcija za intervjuera</h2>
            <div className="intro-text">
              <p>Ne procenjujte kandidata samo po tome koliko je komunikativan ili simpatičan.</p>
              <p><strong>U Zeppelin Pro najvažnije su:</strong></p>
              <div className="tags-grid">
                <span>Energija</span><span>Organizacija</span><span>Brzina razmišljanja</span>
                <span>Stabilnost pod pritiskom</span>
                <span 
                  onClick={() => setShowOwnershipModal(true)}
                  style={{ cursor: 'pointer', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                  title="Klikni za objašnjenje"
                >
                  Ownership <Info size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />
                </span>
                <span>Profesionalnost</span>
                <span>Multitasking</span><span>Otpornost na odbijanje</span><span>Komunikacija</span>
              </div>
              
              <div className="observe-box">
                <h4>Posmatrajte kandidata od trenutka ulaska:</h4>
                <ul>
                  <li>Kontakt očima i sigurnost</li>
                  <li>Energiju i način komunikacije</li>
                  <li>Brzinu odgovora i logiku razmišljanja</li>
                  <li>Fokus i ownership mindset</li>
                  <li>Odnos prema problemima i odgovornosti</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: DOLAZAK */}
        {step === 1 && (
          <div className="step-panel">
            <h2>KORAK 1 — Dolazak kandidata (Prvi utisak)</h2>
            <div className="instruction-box">
              <strong>Instrukcija intervjueru:</strong> Procena počinje od trenutka ulaska. Posmatrajte tačnost dolaska, držanje tela, energiju, kontakt očima, sigurnost, način pozdravljanja, profesionalnost i kulturu ponašanja.
            </div>
            
            <div className="form-group boolean-group">
              <label>Kandidat došao na vreme?</label>
              <div className="btn-group">
                <button className={`btn-toggle ${arrivedOnTime === true ? 'active-success' : ''}`} onClick={() => { setArrivedOnTime(true); handleNote('arrivedOnTime', 'DA'); }}>DA</button>
                <button className={`btn-toggle ${arrivedOnTime === false ? 'active-danger' : ''}`} onClick={() => { setArrivedOnTime(false); handleNote('arrivedOnTime', 'NE'); }}>NE</button>
              </div>
            </div>

            <div className="ratings-grid">
              <RatingRow label="Energija pri ulasku" id="s1_energija" score={scores.s1_energija} onScore={handleScore} />
              <RatingRow label="Kontakt očima" id="s1_kontakt" score={scores.s1_kontakt} onScore={handleScore} />
              <RatingRow label="Sigurnost" id="s1_sigurnost" score={scores.s1_sigurnost} onScore={handleScore} />
              <RatingRow label="Profesionalnost" id="s1_prof" score={scores.s1_prof} onScore={handleScore} />
              <RatingRow label="Komunikativnost" id="s1_komunikativnost" score={scores.s1_komunikativnost} onScore={handleScore} />
              <RatingRow label="Vizuelni utisak" id="s1_vizuelni" score={scores.s1_vizuelni} onScore={handleScore} />
            </div>

            <div className="form-group mt-2">
              <label>Zapažanja prvog utiska</label>
              <textarea 
                className="text-input" 
                rows={3} 
                value={notes.s1 || ''} 
                onChange={e => handleNote('s1', e.target.value)} 
                placeholder="Unesite zapažanja..." 
              />
            </div>
          </div>
        )}

        {/* STEP 2: UVODNI DEO */}
        {step === 2 && (
          <div className="step-panel">
            <h2>KORAK 2 — Uvodni deo razgovora</h2>
            <div className="script-box highlight">
              <span className="badge badge-primary">SKRIPTA ZA INTERVJERA:</span>
              <p><em>"Dobrodošli i hvala što ste došli."</em></p>
              <p><em>"Mi smo Zeppelin Pro iz Beograda i bavimo se reklamnim materijalom, poslovnim poklonima i brandingom za kompanije. Više od 10 godina sarađujemo sa velikim brojem domaćih i internacionalnih firmi."</em></p>
              <p><em>"Posao kod nas je veoma dinamičan i uključuje dosta komunikacije, koordinacije, rada sa klijentima, rešavanja problema, rada pod pritiskom, multitasking i organizaciju velikog broja detalja."</em></p>
              <p><em>"Naši klijenti često imaju kratke rokove, specifične zahteve i očekuju brzu i profesionalnu reakciju, tako da nam je veoma važna organizovanost, odgovornost i način komunikacije."</em></p>
              <p><em>"Ovo nije klasičan kancelarijski posao gde se svaki dan ponavlja isto, već pozicija za osobu koja voli dinamično okruženje, zna da razmišlja unapred, preuzima odgovornost i održava dobar odnos sa klijentima i kolegama."</em></p>
            </div>
            
            <div className="instruction-box mt-3">
              <strong>Značaj ovakvog uvoda:</strong>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                <li>filtrira ljude koji traže „lagan administrativni posao”,</li>
                <li>privlači energičnije i organizovanije kandidate,</li>
                <li>i odmah postavlja ozbiljan ton razgovora.</li>
              </ul>
              <strong>Savet za intervjuera:</strong>
              <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Prvih 60–90 sekundi treba da zvučite smireno, profesionalno i samouvereno — ne previše prijateljski i ne previše „korporativno hladno”. Kandidat tada podsvesno procenjuje:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0', marginBottom: '0' }}>
                <li>stabilnost firme,</li>
                <li>kulturu,</li>
                <li>nivo organizacije,</li>
                <li>i autoritet ljudi preko puta njega.</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 3: O KANDIDATU */}
        {step === 3 && (
          <div className="step-panel">
            <h2>KORAK 3 — Pitanje o kandidatu i osnovne informacije</h2>
            <div className="question-highlight">
              <strong>PITANJE:</strong> "Recite nam nešto o sebi i svom dosadašnjem iskustvu."
            </div>
            
            <div className="instruction-box">
              <strong>Instrukcija intervjueru:</strong> Popunite osnovne informacije tokom razgovora o iskustvu. Ne procenjujte samo sadržaj odgovora. Posmatrajte i strukturu govora, sigurnost, logiku.
            </div>


            <div className="ratings-grid">
              <RatingRow label="Jasnoća komunikacije" id="s3_jasnoca" score={scores.s3_jasnoca} onScore={handleScore} />
              <RatingRow label="Struktura odgovora" id="s3_struktura" score={scores.s3_struktura} onScore={handleScore} />
              <RatingRow label="Energija" id="s3_energija" score={scores.s3_energija} onScore={handleScore} />
              <RatingRow label="Sigurnost" id="s3_sigurnost" score={scores.s3_sigurnost} onScore={handleScore} />
              <RatingRow label="Fokus" id="s3_fokus" score={scores.s3_fokus} onScore={handleScore} />
              <RatingRow label="Profesionalnost" id="s3_prof" score={scores.s3_prof} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s3" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 4: MOTIVACIJA */}
        {step === 4 && (
          <div className="step-panel">
            <h2>KORAK 4 — Motivacija</h2>
            <div className="question-highlight">
              <strong>PITANJA:</strong>
              <ul>
                <li>"Zašto ste se prijavili baš za ovu poziciju?"</li>
                <li>"Šta vas privlači radu sa B2B klijentima?"</li>
                <li>"Šta znate o Zeppelin Pro?"</li>
              </ul>
            </div>
            
            <div className="instruction-box">
              <strong>Posmatrajte:</strong> pripremljenost, zainteresovanost, inicijativu, ozbiljnost, nivo motivacije.
              <br/><strong className="text-danger">Crvene zastavice:</strong> nije istražio firmu, ne zna čime se firma bavi, generički odgovori, deluje nezainteresovano.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Motivacija" id="s4_motivacija" score={scores.s4_motivacija} onScore={handleScore} />
              <RatingRow label="Pripremljenost" id="s4_priprema" score={scores.s4_priprema} onScore={handleScore} />
              <RatingRow label="Ozbiljnost" id="s4_ozbiljnost" score={scores.s4_ozbiljnost} onScore={handleScore} />
              <RatingRow label="Energija" id="s4_energija" score={scores.s4_energija} onScore={handleScore} />
              <RatingRow label="Interesovanje za posao" id="s4_interes" score={scores.s4_interes} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s4" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 5: KOMUNIKACIJA I TELEFON */}
        {step === 5 && (
          <div className="step-panel">
            <h2>KORAK 5 — Komunikacija i Telefonski rad</h2>
            <div className="question-highlight">
              <strong>PITANJA:</strong>
              <ul>
                <li>"Koliko vam je prijatna svakodnevna komunikacija sa klijentima?"</li>
                <li>"Kako se osećate kada treba da pozovete potpuno novog klijenta?"</li>
                <li>"Da li vam je prirodnije da rešavate stvari pozivom ili porukama?"</li>
              </ul>
            </div>
            
            <div className="instruction-box">
              <strong>Posmatrajte:</strong> sigurnost, prirodnost u komunikaciji, energiju, otpor prema pozivima, prodajni potencijal.
              <br/><strong className="text-danger">Crvene zastavice:</strong> nelagodnost, izbegavanje poziva, pasivnost, nesigurnost.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Sigurnost u komunikaciji" id="s5_sigurnost" score={scores.s5_sigurnost} onScore={handleScore} />
              <RatingRow label="Telefonska komunikacija" id="s5_telefon" score={scores.s5_telefon} onScore={handleScore} />
              <RatingRow label="Prodajni potencijal" id="s5_prodajni" score={scores.s5_prodajni} onScore={handleScore} />
              <RatingRow label="Energija" id="s5_energija" score={scores.s5_energija} onScore={handleScore} />
              <RatingRow label="Prirodnost komunikacije" id="s5_prirodnost" score={scores.s5_prirodnost} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s5" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 6: ORGANIZACIJA */}
        {step === 6 && (
          <div className="step-panel">
            <h2>KORAK 6 — Organizacija i Multitasking</h2>
            <div className="question-highlight">
              <strong>PITANJA:</strong>
              <ul>
                <li>"Kako se snalazite kada imate više hitnih stvari odjednom?"</li>
                <li>"Kako organizujete prioritete?"</li>
                <li>"Možete li dati konkretan primer?"</li>
              </ul>
            </div>
            
            <div className="instruction-box">
              <strong>Posmatrajte:</strong> logiku, organizaciju, ownership mindset, prioritizaciju, stabilnost, način rešavanja problema.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Organizacija" id="s6_organizacija" score={scores.s6_organizacija} onScore={handleScore} />
              <RatingRow label="Logika razmišljanja" id="s6_logika" score={scores.s6_logika} onScore={handleScore} />
              <RatingRow label="Prioritizacija" id="s6_prioriteti" score={scores.s6_prioriteti} onScore={handleScore} />
              <RatingRow label="Stabilnost" id="s6_stabilnost" score={scores.s6_stabilnost} onScore={handleScore} />
              <RatingRow label="Ownership mindset" id="s6_ownership" score={scores.s6_ownership} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s6" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 7: STRES */}
        {step === 7 && (
          <div className="step-panel">
            <h2>KORAK 7 — Stres i Pritisak</h2>
            <div className="question-highlight">
              <strong>PITANJA:</strong>
              <ul>
                <li>"Kako reagujete kada vas klijent ignoriše?"</li>
                <li>"Kako reagujete kada imate problem sa rokom?"</li>
                <li>"Kako funkcionišete pod pritiskom?"</li>
              </ul>
            </div>
            
            <div className="instruction-box">
              <strong>Posmatrajte:</strong> emocionalnu stabilnost, profesionalnost, otpornost, ego reakcije, ownership, smirenost.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Stabilnost pod pritiskom" id="s7_stabilnost" score={scores.s7_stabilnost} onScore={handleScore} />
              <RatingRow label="Profesionalnost" id="s7_prof" score={scores.s7_prof} onScore={handleScore} />
              <RatingRow label="Ownership" id="s7_ownership" score={scores.s7_ownership} onScore={handleScore} />
              <RatingRow label="Smirenost" id="s7_smirenost" score={scores.s7_smirenost} onScore={handleScore} />
              <RatingRow label="Otpornost" id="s7_otpornost" score={scores.s7_otpornost} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s7" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 8: CRM */}
        {step === 8 && (
          <div className="step-panel">
            <h2>KORAK 8 — CRM i Administracija</h2>
            <div className="question-highlight">
              <strong>PITANJA:</strong>
              <ul>
                <li>"Koliko ste radili sa CRM sistemima?"</li>
                <li>"Kako pratite svoje obaveze?"</li>
                <li>"Da li vodite beleške i task liste?"</li>
              </ul>
            </div>
            
            <div className="instruction-box">
              <strong>Posmatrajte:</strong> disciplinu, organizovanost, odnos prema administraciji, sistematičnost.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Organizovanost" id="s8_organizovanost" score={scores.s8_organizovanost} onScore={handleScore} />
              <RatingRow label="Disciplina" id="s8_disciplina" score={scores.s8_disciplina} onScore={handleScore} />
              <RatingRow label="CRM iskustvo" id="s8_crm" score={scores.s8_crm} onScore={handleScore} />
              <RatingRow label="Sistematičnost" id="s8_sistematicnost" score={scores.s8_sistematicnost} onScore={handleScore} />
              <RatingRow label="Administrativna preciznost" id="s8_preciznost" score={scores.s8_preciznost} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s8" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 9: SCENARIO */}
        {step === 9 && (
          <div className="step-panel">
            <h2>KORAK 9 — Scenario Pitanje (Najvažnije)</h2>
            <div className="script-box bg-dark border-warning">
              <span className="badge badge-warning">SCENARIO - PROČITAJTE KANDIDATU:</span>
              <p><em>"Klijent te zove izuzetno nervozan jer su promotivni artikli stigli sa pogrešnom nijansom boje logotipa u odnosu na ono što je odobrio u vizuelnoj pripremi. Rok za njihovu podelu je za dva dana. On viče i zahteva momentalni povraćaj novca i prekid saradnje. Kako vodiš taj razgovor?"</em></p>
            </div>
            
            <div className="instruction-box">
              <strong>OVO JE JEDNO OD NAJVAŽNIJIH PITANJA. Posmatrajte:</strong> logiku, ownership, organizaciju, prioritete, komunikaciju, stabilnost, rešavanje problema.
            </div>

            <div className="ratings-grid">
              <RatingRow label="Organizacija" id="s9_organizacija" score={scores.s9_organizacija} onScore={handleScore} />
              <RatingRow label="Ownership" id="s9_ownership" score={scores.s9_ownership} onScore={handleScore} />
              <RatingRow label="Logika" id="s9_logika" score={scores.s9_logika} onScore={handleScore} />
              <RatingRow label="Stabilnost" id="s9_stabilnost" score={scores.s9_stabilnost} onScore={handleScore} />
              <RatingRow label="Rešavanje problema" id="s9_resavanje" score={scores.s9_resavanje} onScore={handleScore} />
              <RatingRow label="Komunikacija" id="s9_komunikacija" score={scores.s9_komunikacija} onScore={handleScore} />
            </div>

            <NotesAndFlags stepId="s9" notes={notes} redFlags={redFlags} onNote={handleNote} onFlag={handleRedFlag} />
          </div>
        )}

        {/* STEP 10: FINALNA PROCENA */}
        {step === 10 && (
          <div className="step-panel">
            <h2>KORAK 10 — Finalna Procena</h2>
            
            <div className="modal-form-grid" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-bg-alt)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ gridColumn: '1 / -1', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Osnovne informacije o kandidatu</h3>
              <div className="form-group">
                <label>Prethodno iskustvo (Godine)</label>
                <select value={notes.iskustvo || ''} onChange={e => handleNote('iskustvo', e.target.value)} className="text-input">
                  <option value="">Izaberite...</option>
                  <option value="Bez iskustva">Bez iskustva</option>
                  <option value="Manje od 1 godine">Manje od 1 godine</option>
                  <option value="1 - 3 godine">1 - 3 godine</option>
                  <option value="3 - 5 godina">3 - 5 godina</option>
                  <option value="Više od 5 godina">Više od 5 godina</option>
                </select>
              </div>
              <div className="form-group">
                <label>Poslednja firma</label>
                <input type="text" placeholder="Ime firme" className="text-input" value={notes.poslednjaFirma || ''} onChange={e => handleNote('poslednjaFirma', e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Razlog promene posla</label>
                <textarea rows={2} placeholder="Kratko objašnjenje..." className="text-input" value={notes.razlogPromene || ''} onChange={e => handleNote('razlogPromene', e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label>Očekivana primanja na mesečnom nivou</label>
                <input type="text" placeholder="Npr. 120.000 RSD" className="text-input" value={notes.ocekivanaPlata || ''} onChange={e => handleNote('ocekivanaPlata', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Dostupnost za početak rada</label>
                <select value={notes.dostupnost || ''} onChange={e => handleNote('dostupnost', e.target.value)} className="text-input">
                  <option value="">Izaberite...</option>
                  <option value="Odmah">Odmah</option>
                  <option value="Za 2 nedelje">Za 2 nedelje</option>
                  <option value="Za mesec dana">Za mesec dana</option>
                </select>
              </div>
            </div>

            <div className="final-grid">
              {/* Leva kolona: Polja za unos */}
              <div className="final-inputs">
                <div className="form-group">
                  <label>Najveće prednosti kandidata</label>
                  <textarea className="text-input" rows={2} value={notes.final_prednosti || ''} onChange={e => handleNote('final_prednosti', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Najveći rizici</label>
                  <textarea className="text-input" rows={2} value={notes.final_rizici || ''} onChange={e => handleNote('final_rizici', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="text-danger">Crvene zastavice</label>
                  <textarea className="text-input danger-input" rows={2} value={redFlags.final_zastavice || ''} onChange={e => handleRedFlag('final_zastavice', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Potencijal za razvoj</label>
                  <textarea className="text-input" rows={2} value={notes.final_potencijal || ''} onChange={e => handleNote('final_potencijal', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Kompatibilnost sa Zeppelin Pro kulturom</label>
                  <textarea className="text-input" rows={2} value={notes.final_kultura || ''} onChange={e => handleNote('final_kultura', e.target.value)} />
                </div>
                
                <div className="recommendation-box" style={{ marginTop: '1.5rem' }}>
                  <label style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}>Ukupan utisak (1 do 10)</label>
                  <div className="rating-stars" style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <button 
                        key={num} 
                        className={`star-btn ${Number(recommendation) >= num ? 'active' : ''}`}
                        onClick={() => setRecommendation(String(num))}
                        style={{ padding: '0.25rem', cursor: 'pointer', border: 'none', background: 'none' }}
                      >
                        <Star size={32} fill={Number(recommendation) >= num ? "var(--warning)" : "none"} stroke={Number(recommendation) >= num ? "var(--warning)" : "var(--color-text-muted)"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desna kolona: Automatski Score & Radar */}
              <div className="final-stats">
                <div className="total-score-box">
                  <span className="ts-label">Ukupan Score</span>
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
        {step < 10 ? (
          <button className="btn-primary" onClick={nextStep}>
            {step === 0 ? "Pređi na pitanja" : "Sledeći Korak"} <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-primary success-btn" onClick={handleSaveAll}>
            Završi i Sačuvaj Procenu <CheckCircle size={18} />
          </button>
        )}
      </div>

      {/* Ownership Modal */}
      {showOwnershipModal && (
        <div className="modal-overlay" onClick={() => setShowOwnershipModal(false)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>Ownership Mindset</h2>
              <button className="btn-close" onClick={() => setShowOwnershipModal(false)}><XCircle size={24} /></button>
            </div>
            <div className="modal-body" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
              <p><strong>Ownership mindset</strong> predstavlja način razmišljanja kod osobe koja preuzima odgovornost za posao, rezultate i rešavanje problema, bez traženja izgovora ili prebacivanja krivice na druge.</p>
              
              <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--danger)' }}>Osoba sa ownership mindset-om NE razmišlja:</h4>
              <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>„To nije moj posao.“</li>
                <li>„Nisam ja kriv.“</li>
                <li>„Niko mi nije rekao.“</li>
              </ul>

              <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Već razmišlja:</h4>
              <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>„Kako mogu da rešim problem?“</li>
                <li>„Šta mogu da uradim da posao uspe?“</li>
                <li>„Kako da pomognem timu i klijentu?“</li>
              </ul>

              <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Takva osoba:</h4>
              <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>preuzima inicijativu,</li>
                <li>vodi računa o rokovima,</li>
                <li>sama prati zadatke do kraja,</li>
                <li>razmišlja unapred,</li>
                <li>traži rešenja umesto krivca,</li>
                <li>ponaša se odgovorno prema firmi, klijentima i kolegama.</li>
              </ul>

              <p style={{ marginBottom: '1.5rem' }}>Ownership mindset ne znači da osoba mora sve sama da radi, već da oseća odgovornost za krajnji rezultat i aktivno učestvuje u rešavanju problema.</p>

              <div style={{ background: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Primer ownership mindset-a:</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--danger)' }}><strong>Umesto:</strong><br/>„Dobavljač kasni, nije do mene.“</p>
                <p style={{ margin: 0, color: 'var(--success)' }}><strong>Osoba sa ownership mindset-om kaže:</strong><br/>„Dobavljač kasni. Kontaktiraću ga odmah, obavestiću klijenta i pronaći alternativu kako bismo smanjili problem.“</p>
              </div>

              <p style={{ marginBottom: '1rem' }}>U poslovnom okruženju, posebno u prodaji, logistici, organizaciji i radu sa klijentima, ownership mindset je jedna od najvažnijih osobina jer omogućava:</p>
              <ul style={{ marginBottom: '1.5rem', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li>veću pouzdanost,</li>
                <li>bolju organizaciju,</li>
                <li>manje kontrole od strane menadžmenta,</li>
                <li>brže rešavanje problema,</li>
                <li>kvalitetniju komunikaciju sa klijentima i timom.</li>
              </ul>

              <p style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>Cilj ownership mindset-a je da zaposleni ne bude samo izvršilac zadataka, već osoba koja aktivno doprinosi uspehu firme i razmišlja kao deo tima koji zajedno ostvaruje rezultat.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowOwnershipModal(false)}>Razumem</button>
            </div>
          </div>
        </div>
      )}
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
          placeholder="Unesite beleške o odgovorima..." 
        />
      </div>
      <div className="form-group">
        <label className="text-danger"><AlertTriangle size={14}/> Crvene zastavice</label>
        <textarea 
          className="text-input danger-input" 
          rows={3} 
          value={redFlags[stepId] || ''} 
          onChange={e => onFlag(stepId, e.target.value)} 
          placeholder="Ako ste primetili crvene zastavice, unesite ih ovde..." 
        />
      </div>
    </div>
  );
};

export default FirstRoundWizard;
