import React from 'react';
import { Target, AlertTriangle, CheckCircle, Zap, Shield, UserX } from 'lucide-react';
import './Onboarding.css';

const Onboarding: React.FC = () => {
  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Šta zapravo tražimo kod kandidata</h1>
        <p>Edukativna sekcija za intervjuere kompanije Zeppelin Pro</p>
      </div>

      <div className="card intro-card">
        <p className="highlight-text">
          Kompanija Zeppelin Pro <strong>ne traži</strong> klasične prodavce niti osobe koje samo lepo komuniciraju.
        </p>
      </div>

      <div className="traits-grid">
        <div className="card trait-card">
          <div className="trait-icon"><Zap /></div>
          <h3>Tražimo osobe koje:</h3>
          <ul>
            <li>Imaju energiju</li>
            <li>Brzo razmišljaju</li>
            <li>Podnose pritisak</li>
            <li>Umeju da organizuju više stvari paralelno</li>
            <li>Imaju profesionalnu komunikaciju</li>
            <li>Umeju da vode klijenta kroz proces</li>
            <li>Ne odustaju lako</li>
            <li>Imaju disciplinu</li>
            <li>Stabilne su pod stresom</li>
            <li>Mogu da koordiniraju veliki broj detalja i rokova</li>
          </ul>
        </div>

        <div className="card trait-card">
          <div className="trait-icon"><Target /></div>
          <h3>Najvažnije osobine:</h3>
          <div className="tags">
            <span className="badge badge-active">Organizacija</span>
            <span className="badge badge-active">Brzina</span>
            <span className="badge badge-active">Stabilnost</span>
            <span className="badge badge-active">Energija</span>
            <span className="badge badge-active">Komunikacija</span>
            <span className="badge badge-active">Odgovornost</span>
            <span className="badge badge-active">Otpornost na odbijanje</span>
            <span className="badge badge-active">Disciplina</span>
          </div>
        </div>
      </div>

      <div className="work-scope-section">
        <div className="card">
          <h3><BriefcaseIcon /> Posao uključuje:</h3>
          <div className="grid-list">
            <div className="list-item"><CheckCircle size={16} /> Veliki broj telefonskih razgovora</div>
            <div className="list-item"><CheckCircle size={16} /> Svakodnevni follow-up</div>
            <div className="list-item"><CheckCircle size={16} /> Koordinaciju sa dobavljačima i proizvodnjom</div>
            <div className="list-item"><CheckCircle size={16} /> Organizaciju isporuka</div>
            <div className="list-item"><CheckCircle size={16} /> Rešavanje problema u hodu</div>
            <div className="list-item"><CheckCircle size={16} /> Rad pod vremenskim pritiskom i multitasking</div>
            <div className="list-item"><CheckCircle size={16} /> Rad u CRM sistemu i administraciju</div>
          </div>
        </div>
      </div>

      <div className="warnings-grid">
        <div className="card danger-card">
          <h3><AlertTriangle className="danger-icon" /> Najveće greške pri selekciji</h3>
          <ul>
            <li>Birati najpričljivije osobe</li>
            <li>Birati samo na osnovu CV-ja</li>
            <li>Zanemariti organizaciju i disciplinu</li>
            <li>Ignorisati crvene zastavice</li>
          </ul>
        </div>

        <div className="card attention-card">
          <h3><Shield className="attention-icon" /> Posebno obraćati pažnju na:</h3>
          <ul>
            <li>Nivo energije i brzinu odgovora</li>
            <li>Jasnoću komunikacije i logiku razmišljanja</li>
            <li>Organizaciju i emocionalnu stabilnost</li>
            <li>Odnos prema pritisku i odgovornosti</li>
            <li>Način rešavanja problema</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default Onboarding;
