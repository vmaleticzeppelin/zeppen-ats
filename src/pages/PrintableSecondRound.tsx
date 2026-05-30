import React, { useEffect } from 'react';
import './PrintableFirstRound.css';

const PrintableSecondRound: React.FC = () => {
  useEffect(() => {
    // Automatski otvara prozor za stampu nakon renderovanja
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="printable-container">
      <div className="print-header">
        <h1>DRUGI KRUG SELEKCIJE - PRAKTIČNA PROCENA</h1>
        <div className="print-meta" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
          <div><strong>Ime kandidata:</strong> ______________________</div>
          <div><strong>Datum:</strong> ______________________</div>
          <div><strong>Intervjuer:</strong> ______________________</div>
        </div>
      </div>

      <div className="print-section">
        <h2>SVRHA DRUGOG KRUGA (60-90 min)</h2>
        <p>Cilj je da utvrdimo kako kandidat razmišlja, organizuje posao, komunicira, prodaje, rešava probleme i funkcioniše pod pritiskom. Drugi krug vode dve osobe (jedna vodi razgovor, druga procenjuje i beleži).</p>
      </div>

      <div className="print-section">
        <h2>KORAK 1 — Analiza iskustva (10 min)</h2>
        <p><strong>Pitanja:</strong> Koji je vaš najveći uspeh? Na šta ste ponosni? Šta biste uradili drugačije? Zašto ste bili uspešni?</p>
        <div className="score-row">
          <span>Ownership: 1 2 3 4 5</span>
          <span>Odgovornost: 1 2 3 4 5</span>
          <span>Samopouzdanje: 1 2 3 4 5</span>
          <span>Zrelost: 1 2 3 4 5</span>
          <span>Kvalitet iskustva: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
          <div className="lines"></div>
        </div>
        <div className="flags-box">
          <p>Crvene zastavice:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 2 — Simulacija prodaje (20 min)</h2>
        <p><strong>Scenario:</strong> Direktor firme (50 zaposlenih) traži poslovne poklone. Zadatak kandidata: "Prodajte mi sastanak." (Ne sme odmah nuditi proizvode!)</p>
        <div className="score-row">
          <span>Kontakt: 1 2 3 4 5</span>
          <span>Pitanja: 1 2 3 4 5</span>
          <span>Slušanje: 1 2 3 4 5</span>
          <span>Energija: 1 2 3 4 5</span>
        </div>
        <div className="score-row">
          <span>Sigurnost: 1 2 3 4 5</span>
          <span>Vođenje: 1 2 3 4 5</span>
          <span>Prodaja: 1 2 3 4 5</span>
          <span>Zaključivanje: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
          <div className="lines"></div>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 3 — Organizacija i prioriteti (15 min)</h2>
        <p><strong>Scenario:</strong> 08:00h. Imate: 2 hitne ponude, izveštaj za direktora, problem sa dobavljačem, klijent čeka, vozač čeka, 3 nova upita. Koji je redosled rešavanja i zašto?</p>
        <div className="score-row">
          <span>Organizacija: 1 2 3 4 5</span>
          <span>Prioriteti: 1 2 3 4 5</span>
          <span>Logika: 1 2 3 4 5</span>
          <span>Ownership: 1 2 3 4 5</span>
          <span>Stabilnost: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
          <div className="lines"></div>
        </div>
      </div>

      <div className="page-break"></div>

      <div className="print-section">
        <h2>KORAK 4 — Email test (15 min)</h2>
        <p><strong>Zadatak:</strong> Napiši email klijentu koji traži 300 rokovnika za događaj koji je za 10 dana.</p>
        <div className="score-row">
          <span>Profesionalnost: 1 2 3 4 5</span>
          <span>Struktura: 1 2 3 4 5</span>
          <span>Pravopis: 1 2 3 4 5</span>
          <span>Jasnoća: 1 2 3 4 5</span>
          <span>Inicijativa: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 5 — Težak klijent (15 min)</h2>
        <p><strong>Scenario:</strong> "Konkurencija mi je dala nižu cenu." / "Kasnite." / "Nisam zadovoljan."</p>
        <div className="score-row">
          <span>Stabilnost: 1 2 3 4 5</span>
          <span>Empatija: 1 2 3 4 5</span>
          <span>Komunikacija: 1 2 3 4 5</span>
          <span>Pregovaranje: 1 2 3 4 5</span>
          <span>Konflikt: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 6 — Poklon projekat (15 min)</h2>
        <p><strong>Zadatak:</strong> Klijent 100 zaposlenih, 25 EUR budžet. Napravi i prezentuj predlog.</p>
        <div className="score-row">
          <span>Potrebe: 1 2 3 4 5</span>
          <span>Kreativnost: 1 2 3 4 5</span>
          <span>Poslovna logika: 1 2 3 4 5</span>
          <span>Prezentacija: 1 2 3 4 5</span>
          <span>Budžet: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 7 — Završna procena</h2>
        <div className="score-row">
          <span>Organizacija ukupno: 1 2 3 4 5</span>
          <span>Prodajni potencijal: 1 2 3 4 5</span>
          <span>Ownership: 1 2 3 4 5</span>
        </div>
        <div className="score-row">
          <span>Komunikacija ukupno: 1 2 3 4 5</span>
          <span>Stabilnost ukupno: 1 2 3 4 5</span>
          <span>Pisana komunikacija: 1 2 3 4 5</span>
          <span>Uklapanje u kulturu: 1 2 3 4 5</span>
        </div>
        
        <div className="notes-box" style={{ marginTop: '1rem' }}>
          <p>Najveće prednosti:</p>
          <div className="lines"></div>
        </div>
        <div className="notes-box">
          <p>Najveći rizici:</p>
          <div className="lines"></div>
        </div>
        <div className="notes-box">
          <p>Potencijal za razvoj:</p>
          <div className="lines"></div>
        </div>
        
        <div style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          PREPORUKA (Zaokruži): &nbsp;&nbsp;&nbsp; DA (Probni rad) &nbsp;&nbsp;&nbsp; MOŽDA (Dodatni razgovor) &nbsp;&nbsp;&nbsp; NE (Odbiti)
        </div>
      </div>

    </div>
  );
};

export default PrintableSecondRound;
