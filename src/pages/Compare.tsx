import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import './Compare.css';

const comparisonData = [
  { subject: 'Energija', Marko: 90, Jelena: 85, fullMark: 100 },
  { subject: 'Organizacija', Marko: 85, Jelena: 95, fullMark: 100 },
  { subject: 'Komunikacija', Marko: 95, Jelena: 80, fullMark: 100 },
  { subject: 'Stabilnost', Marko: 80, Jelena: 90, fullMark: 100 },
  { subject: 'Prodaja', Marko: 88, Jelena: 75, fullMark: 100 },
  { subject: 'Disciplina', Marko: 82, Jelena: 95, fullMark: 100 },
];

const Compare: React.FC = () => {
  return (
    <div className="compare-container">
      <div className="page-header">
        <div className="header-info">
          <h1>Poređenje Kandidata</h1>
          <p>Uporedna analiza Score rezultata i procena intervjuera</p>
        </div>
        <div className="compare-actions">
          <button className="btn-secondary">Izaberi kandidate</button>
          <button className="btn-primary">Generiši Finalni Izveštaj <ArrowRight size={18}/></button>
        </div>
      </div>

      <div className="compare-content">
        <div className="card chart-section">
          <h3>Uporedni Radar Chart</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={comparisonData}>
                <PolarGrid stroke="#383D47" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A5B1', fontSize: 13 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A0A5B1' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#24272D', borderColor: '#383D47', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Radar name="Marko Marković" dataKey="Marko" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.4} />
                <Radar name="Jelena Jović" dataKey="Jelena" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="candidates-side-by-side">
          {/* Candidate 1 */}
          <div className="candidate-col">
            <div className="c-profile-header">
              <div className="c-avatar-large" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)', color: '#FF6B00', borderColor: '#FF6B00' }}>M</div>
              <div className="c-info-large">
                <h2>Marko Marković</h2>
                <span className="c-overall-score" style={{ color: '#FF6B00' }}>Ukupan Score: 92%</span>
              </div>
            </div>

            <div className="c-strengths-weaknesses">
              <div className="sw-box positive">
                <h4><CheckCircle size={16} /> Glavne prednosti</h4>
                <ul>
                  <li>Izuzetna energija u komunikaciji</li>
                  <li>Prirodan prodajni instinkt</li>
                  <li>Lako rešava prigovore</li>
                </ul>
              </div>
              <div className="sw-box negative">
                <h4><AlertTriangle size={16} /> Rizici i zastavice</h4>
                <ul>
                  <li>Nešto slabija disciplina u CRM-u</li>
                  <li>Moguć manjak fokusa na sitnim detaljima</li>
                </ul>
              </div>
            </div>
            
            <div className="ai-summary">
              <div className="ai-badge">AI Procena</div>
              <p>Marko poseduje veoma visok "hunter" prodajni mentalitet. Najbolje će se snalaziti u akviziciji novih klijenata, ali će zahtevati strožiju kontrolu nad unosom podataka.</p>
            </div>
          </div>

          {/* Candidate 2 */}
          <div className="candidate-col">
            <div className="c-profile-header">
              <div className="c-avatar-large" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderColor: '#3B82F6' }}>J</div>
              <div className="c-info-large">
                <h2>Jelena Jović</h2>
                <span className="c-overall-score" style={{ color: '#3B82F6' }}>Ukupan Score: 88%</span>
              </div>
            </div>

            <div className="c-strengths-weaknesses">
              <div className="sw-box positive">
                <h4><CheckCircle size={16} /> Glavne prednosti</h4>
                <ul>
                  <li>Besprekorna organizacija i disciplina</li>
                  <li>Vrlo stabilna pod stresom</li>
                  <li>Odličan multitasking</li>
                </ul>
              </div>
              <div className="sw-box negative">
                <h4><AlertTriangle size={16} /> Rizici i zastavice</h4>
                <ul>
                  <li>Malo tiša komunikacija</li>
                  <li>Potrebno vreme da izgradi prodajno samopouzdanje</li>
                </ul>
              </div>
            </div>

            <div className="ai-summary">
              <div className="ai-badge">AI Procena</div>
              <p>Jelena ima izvanredan "farmer" potencijal i strukturu. Njena stabilnost garantuje kvalitetan dugoročni rad, ali joj može biti neprijatno kod agresivnijeg cold-calling-a.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
