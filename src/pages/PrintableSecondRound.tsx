import React, { useEffect } from 'react';
import './PrintableFirstRound.css';

const PrintableSecondRound: React.FC = () => {
  useEffect(() => {
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
        <h2>SVRHA DRUGOG KRUGA (75-90 min)</h2>
        <p>Praktična procena kandidata kroz simulacije stvarnih situacija. Cilj je proceniti ownership, organizaciju, prodaju, stabilnost pod pritiskom, komunikaciju i rešavanje problema.</p>
      </div>

      <div className="print-section">
        <h2>KORAK 1 — Rekonekcija i otvaranje (5 min)</h2>
        <p><strong>Pitanje:</strong> "Prošlo je nekoliko dana od našeg prvog razgovora. Kako vam danas izgleda naša priča i šta vam je najviše ostalo u sećanju iz razgovora o firmi i poziciji?"</p>
        <div className="score-row">
          <span>Zainteresovanost: 1 2 3 4 5</span>
          <span>Energija: 1 2 3 4 5</span>
          <span>Pripremljenost: 1 2 3 4 5</span>
          <span>Kompatibilnost: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 2 — Ownership Test (10 min)</h2>
        <p><strong>Pitanja:</strong> Ispričajte najveću grešku koju ste napravili na poslu. Kako ste rešili situaciju? Šta ste naučili?</p>
        <div className="score-row">
          <span>Ownership: 1 2 3 4 5</span>
          <span>Odgovornost: 1 2 3 4 5</span>
          <span>Iskrenost: 1 2 3 4 5</span>
          <span>Zrelost: 1 2 3 4 5</span>
          <span>Učenje: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 3 — Problem sa štamparom (15 min)</h2>
        <p><strong>Scenario:</strong> Intervjuer glumi klijenta: "Ćao, ovde Marko. Samo proveravam. Događaj nam je za dva dana. Da li je sve spremno?". <strong>Dodatna info:</strong> Štampar ne odgovara, roba kasni.</p>
        <div className="score-row">
          <span>Ownership: 1 2 3 4 5</span>
          <span>Komunikacija: 1 2 3 4 5</span>
          <span>Empatija: 1 2 3 4 5</span>
          <span>Stabilnost: 1 2 3 4 5</span>
          <span>Rešavanje: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
          <div className="lines"></div>
        </div>
      </div>

      <div className="page-break"></div>

      <div className="print-section">
        <h2>KORAK 4 — Hladni poziv - Sekretarica (7 min)</h2>
        <p><strong>Scenario:</strong> Intervjuer glumi sekretaricu ("Direktor nije tu", "Pošaljite na info"). Cilj kandidata je da dođe do decision makera.</p>
        <div className="score-row">
          <span>Upornost: 1 2 3 4 5</span>
          <span>Energija: 1 2 3 4 5</span>
          <span>Komunikacija: 1 2 3 4 5</span>
          <span>Snalažljivost: 1 2 3 4 5</span>
          <span>Profesionalnost: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 5 — Hladni poziv - Direktor (7 min)</h2>
        <p><strong>Scenario:</strong> Intervjuer: "Čuo sam za vas, ali već 3 godine radimo sa istim dobavljačem i nemamo razlog da menjamo."</p>
        <div className="score-row">
          <span>Prodaja: 1 2 3 4 5</span>
          <span>Slušanje: 1 2 3 4 5</span>
          <span>Pitanja: 1 2 3 4 5</span>
          <span>Vođenje: 1 2 3 4 5</span>
          <span>Zaključivanje: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 6 — Test prioritizacije (15 min)</h2>
        <p><strong>Scenario 08:00h:</strong> 2 hitne ponude, vozač čeka, direktor traži izveštaj, problem sa dobavljačem, klijent čeka, 3 nova upita. Šta radiš narednih 30 min?</p>
        <div className="score-row">
          <span>Organizacija: 1 2 3 4 5</span>
          <span>Logika: 1 2 3 4 5</span>
          <span>Prioritizacija: 1 2 3 4 5</span>
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
        <h2>KORAK 7 — Poklon projekat (15 min)</h2>
        <p><strong>Zadatak:</strong> Klijent 120 zaposlenih, 25 EUR budžet. Napravi predlog iz kataloga i prezentuj.</p>
        <div className="score-row">
          <span>Logika: 1 2 3 4 5</span>
          <span>Kreativnost: 1 2 3 4 5</span>
          <span>Potrebe klijenta: 1 2 3 4 5</span>
          <span>Prezentacija: 1 2 3 4 5</span>
          <span>Komercijalno: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>KORAK 8 — Uslovi i motivacija (10 min)</h2>
        <p><strong>Pitanja:</strong> Šta vas najviše motiviše u prodaji? Šta očekujete od poslodavca? Kako gledate na bonuse?</p>
        <div className="score-row">
          <span>Motivacija: 1 2 3 4 5</span>
          <span>Ambicija: 1 2 3 4 5</span>
          <span>Proaktivnost: 1 2 3 4 5</span>
          <span>Učenje: 1 2 3 4 5</span>
        </div>
        <div className="notes-box">
          <p>Beleške:</p>
          <div className="lines"></div>
        </div>
      </div>

      <div className="print-section">
        <h2>ZAVRŠNA PROCENA</h2>
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Poveriti najvećeg klijenta?</strong> DA / NE</p>
          <p><strong>Zaposliti danas?</strong> DA / NE</p>
        </div>
        
        <div className="notes-box">
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
        <div className="notes-box">
          <p>Konačne crvene zastavice:</p>
          <div className="lines"></div>
        </div>
        
        <div style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          KONAČNA PREPORUKA: &nbsp;&nbsp;&nbsp; PROBNI RAD &nbsp;&nbsp;&nbsp; DODATNI RAZGOVOR &nbsp;&nbsp;&nbsp; ODBITI
        </div>
      </div>

    </div>
  );
};

export default PrintableSecondRound;
