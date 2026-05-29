import React, { useEffect } from 'react';
import './PrintableFirstRound.css';

const PrintableFirstRound: React.FC = () => {
  useEffect(() => {
    // Automatically open print dialog a moment after component mounts
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  const RatingRow = ({ label }: { label: string }) => (
    <tr>
      <td width="60%">{label}</td>
      <td width="40%" style={{ textAlign: 'center' }}>
        <span className="stars-placeholder">☆ ☆ ☆ ☆ ☆</span>
      </td>
    </tr>
  );

  return (
    <div className="print-container">
      <div className="print-header">
        <h1>Zeppelin Pro - Prvi krug intervjua</h1>
      </div>

      <div className="candidate-info-box">
        <div className="info-line">
          <span>Kandidat:</span> <div className="line-blank"></div>
        </div>
        <div className="info-line">
          <span>Intervjuer:</span> <div className="line-blank"></div>
        </div>
        <div className="info-line">
          <span>Datum:</span> <div className="line-blank"></div>
        </div>
      </div>

      {/* STEP 1 */}
      <div className="step-section no-break">
        <h2>KORAK 1 — Dolazak kandidata (Prvi utisak)</h2>
        <div className="print-instruction">
          Procena počinje od trenutka ulaska. Posmatrajte tačnost dolaska, držanje tela, energiju, kontakt očima, sigurnost, način pozdravljanja, profesionalnost i kulturu ponašanja.
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Kandidat došao na vreme?</strong> &nbsp;&nbsp; [ ] DA &nbsp;&nbsp;&nbsp; [ ] NE
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Energija pri ulasku" />
            <RatingRow label="Kontakt očima" />
            <RatingRow label="Sigurnost" />
            <RatingRow label="Profesionalnost" />
            <RatingRow label="Komunikativnost" />
            <RatingRow label="Vizuelni utisak" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Zapažanja prvog utiska:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      {/* STEP 2 */}
      <div className="step-section no-break">
        <h2>KORAK 2 — Uvodni deo razgovora</h2>
        <div className="print-script">
          <strong>PROČITATI KANDIDATU:</strong><br/>
          "Dobrodošli i hvala što ste došli."<br/><br/>
          "Mi smo Zeppelin Pro iz Beograda i bavimo se reklamnim materijalom, poslovnim poklonima i brandingom za kompanije. Više od 10 godina sarađujemo sa velikim brojem domaćih i internacionalnih firmi."<br/><br/>
          "Posao kod nas je veoma dinamičan i uključuje dosta komunikacije, koordinacije, rada sa klijentima, rešavanja problema, rada pod pritiskom, multitasking i organizaciju velikog broja detalja."<br/><br/>
          "Naši klijenti često imaju kratke rokove, specifične zahteve i očekuju brzu i profesionalnu reakciju, tako da nam je veoma važna organizovanost, odgovornost i način komunikacije."<br/><br/>
          "Ovo nije klasičan kancelarijski posao gde se svaki dan ponavlja isto, već pozicija za osobu koja voli dinamično okruženje, zna da razmišlja unapred, preuzima odgovornost i održava dobar odnos sa klijentima i kolegama."
        </div>
      </div>

      <div className="page-break"></div>

      {/* STEP 3 */}
      <div className="step-section no-break">
        <h2>KORAK 3 — Pitanje o kandidatu</h2>
        <div className="print-script">
          <strong>PITANJE:</strong> "Recite nam nešto o sebi i svom dosadašnjem iskustvu."
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Jasnoća komunikacije" />
            <RatingRow label="Struktura odgovora" />
            <RatingRow label="Energija" />
            <RatingRow label="Sigurnost" />
            <RatingRow label="Fokus" />
            <RatingRow label="Profesionalnost" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      {/* STEP 4 */}
      <div className="step-section no-break">
        <h2>KORAK 4 — Motivacija</h2>
        <div className="print-script">
          <strong>PITANJA:</strong><br/>
          - "Zašto ste se prijavili baš za ovu poziciju?"<br/>
          - "Šta vas privlači radu sa B2B klijentima?"<br/>
          - "Šta znate o Zeppelin Pro?"
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Motivacija" />
            <RatingRow label="Pripremljenost" />
            <RatingRow label="Ozbiljnost" />
            <RatingRow label="Energija" />
            <RatingRow label="Interesovanje za posao" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      <div className="page-break"></div>

      {/* STEP 5 */}
      <div className="step-section no-break">
        <h2>KORAK 5 — Komunikacija i Telefonski rad</h2>
        <div className="print-script">
          <strong>PITANJA:</strong><br/>
          - "Koliko vam je prijatna svakodnevna komunikacija sa klijentima?"<br/>
          - "Kako se osećate kada treba da pozovete potpuno novog klijenta?"<br/>
          - "Da li vam je prirodnije da rešavate stvari pozivom ili porukama?"
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Sigurnost u komunikaciji" />
            <RatingRow label="Telefonska komunikacija" />
            <RatingRow label="Prodajni potencijal" />
            <RatingRow label="Energija" />
            <RatingRow label="Prirodnost komunikacije" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      {/* STEP 6 */}
      <div className="step-section no-break">
        <h2>KORAK 6 — Organizacija i Multitasking</h2>
        <div className="print-script">
          <strong>PITANJA:</strong><br/>
          - "Kako se snalazite kada imate više hitnih stvari odjednom?"<br/>
          - "Kako organizujete prioritete?"<br/>
          - "Možete li dati konkretan primer?"
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Organizacija" />
            <RatingRow label="Logika razmišljanja" />
            <RatingRow label="Prioritizacija" />
            <RatingRow label="Stabilnost" />
            <RatingRow label="Ownership mindset" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      <div className="page-break"></div>

      {/* STEP 7 */}
      <div className="step-section no-break">
        <h2>KORAK 7 — Stres i Pritisak</h2>
        <div className="print-script">
          <strong>PITANJA:</strong><br/>
          - "Kako reagujete kada vas klijent ignoriše?"<br/>
          - "Kako reagujete kada imate problem sa rokom?"<br/>
          - "Kako funkcionišete pod pritiskom?"
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Stabilnost pod pritiskom" />
            <RatingRow label="Profesionalnost" />
            <RatingRow label="Ownership" />
            <RatingRow label="Smirenost" />
            <RatingRow label="Otpornost" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      {/* STEP 8 */}
      <div className="step-section no-break">
        <h2>KORAK 8 — CRM i Administracija</h2>
        <div className="print-script">
          <strong>PITANJA:</strong><br/>
          - "Koliko ste radili sa CRM sistemima?"<br/>
          - "Kako pratite svoje obaveze?"<br/>
          - "Da li vodite beleške i task liste?"
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Organizovanost" />
            <RatingRow label="Disciplina" />
            <RatingRow label="CRM iskustvo" />
            <RatingRow label="Sistematičnost" />
            <RatingRow label="Administrativna preciznost" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines"></div>
        </div>
      </div>

      <div className="page-break"></div>

      {/* STEP 9 */}
      <div className="step-section no-break">
        <h2>KORAK 9 — Scenario Pitanje (Najvažnije)</h2>
        <div className="print-script" style={{ borderColor: '#d9534f' }}>
          <strong>SCENARIO - PROČITAJTE KANDIDATU:</strong><br/><br/>
          "Klijent te zove izuzetno nervozan jer su promotivni artikli stigli sa pogrešnom nijansom boje logotipa u odnosu na ono što je odobrio u vizuelnoj pripremi. Rok za njihovu podelu je za dva dana. On viče i zahteva momentalni povraćaj novca i prekid saradnje. Kako vodiš taj razgovor?"
        </div>
        <table className="rating-table">
          <tbody>
            <RatingRow label="Organizacija" />
            <RatingRow label="Ownership" />
            <RatingRow label="Logika" />
            <RatingRow label="Stabilnost" />
            <RatingRow label="Rešavanje problema" />
            <RatingRow label="Komunikacija" />
          </tbody>
        </table>
        <div className="notes-box">
          <strong>Beleške:</strong>
          <div className="notes-lines" style={{ height: '80px' }}></div>
        </div>
      </div>

      {/* STEP 10 */}
      <div className="step-section no-break">
        <h2>KORAK 10 — Finalna Procena</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Prethodno iskustvo (Godine):</span> <div className="line-blank"></div>
          </div>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Poslednja firma:</span> <div className="line-blank"></div>
          </div>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Razlog promene posla:</span> <div className="line-blank"></div>
          </div>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Očekivana primanja na mesečnom nivou:</span> <div className="line-blank"></div>
          </div>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Dostupnost za početak rada:</span> <div className="line-blank"></div>
          </div>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Engleski jezik (nivo i opis korišćenja):</span> <div className="line-blank"></div>
          </div>
          <div className="info-line" style={{ marginBottom: '10px' }}>
            <span>Rad na računaru (šta sve zna):</span> <div className="line-blank"></div>
          </div>
        </div>

        <div className="notes-box">
          <strong>Najveće prednosti kandidata:</strong>
          <div className="notes-lines"></div>
        </div>
        <div className="notes-box">
          <strong>Najveći rizici:</strong>
          <div className="notes-lines"></div>
        </div>
        <div className="notes-box danger-notes">
          <strong style={{ color: '#d9534f' }}>Crvene zastavice:</strong>
          <div className="notes-lines"></div>
        </div>
        <div className="notes-box">
          <strong>Potencijal za razvoj:</strong>
          <div className="notes-lines"></div>
        </div>
        <div className="notes-box">
          <strong>Kompatibilnost sa Zeppelin Pro kulturom:</strong>
          <div className="notes-lines"></div>
        </div>
        
        <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #000', textAlign: 'center' }}>
          <strong>Ukupan utisak (1 do 10):</strong> &nbsp;&nbsp;&nbsp; 1 &nbsp;&nbsp; 2 &nbsp;&nbsp; 3 &nbsp;&nbsp; 4 &nbsp;&nbsp; 5 &nbsp;&nbsp; 6 &nbsp;&nbsp; 7 &nbsp;&nbsp; 8 &nbsp;&nbsp; 9 &nbsp;&nbsp; 10
        </div>
      </div>

    </div>
  );
};

export default PrintableFirstRound;
