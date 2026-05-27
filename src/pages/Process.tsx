import React, { useState } from 'react';
import { UserCheck, Briefcase } from 'lucide-react';
import FirstRoundWizard from '../components/FirstRoundWizard';
import './Process.css';

const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prvi-krug');
  
  return (
    <div className="process-container">
      <div className="process-header">
        <div className="header-info">
          <h1>Selekcioni Proces</h1>
          <p>Kandidat: <strong>Marko Marković</strong> • Pozicija: B2B Savetnik</p>
        </div>
      </div>

      <div className="process-tabs">
        <button className={`tab-btn ${activeTab === 'prvi-krug' ? 'active' : ''}`} onClick={() => setActiveTab('prvi-krug')}>
          1. Prvi krug (Uživo)
        </button>
        <button className={`tab-btn ${activeTab === 'drugi-krug' ? 'active' : ''}`} onClick={() => setActiveTab('drugi-krug')}>
          2. Drugi krug (Napredno)
        </button>
        <button className={`tab-btn ${activeTab === 'treci-krug' ? 'active' : ''}`} onClick={() => setActiveTab('treci-krug')}>
          3. Probni rad (3-5 dana)
        </button>
      </div>

      <div className="process-content">
        {activeTab === 'prvi-krug' && <FirstRoundWizard />}
        
        {activeTab === 'drugi-krug' && (
          <div className="evaluation-form empty-tab">
            <UserCheck size={48} className="empty-icon" />
            <h3>Drugi krug - U pripremi</h3>
            <p>Sadržaj drugog kruga.</p>
          </div>
        )}

        {activeTab === 'treci-krug' && (
          <div className="evaluation-form empty-tab">
            <Briefcase size={48} className="empty-icon" />
            <h3>Probni rad - U pripremi</h3>
            <p>Sadržaj trećeg kruga.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Process;
