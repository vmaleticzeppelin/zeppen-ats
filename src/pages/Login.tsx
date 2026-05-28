import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Login.css';

const ALLOWED_EMAILS = [
  'veljko.maletic@zeppelin.rs',
  'branislav.milosevic@zeppelin.rs',
  'dusan.resanovic@zeppelin.rs',
  'dusan.resanovic@zepppelin.rs',
  'office@zeppelin.rs'
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const emailLower = email.toLowerCase().trim();
      
      if (isRegister) {
        if (!ALLOWED_EMAILS.includes(emailLower)) {
          setError('Nije dozvoljeno kreiranje naloga sa ovom email adresom. Koristite svoj zvanični Zeppelin email.');
          return;
        }
        await createUserWithEmailAndPassword(auth, emailLower, password);
      } else {
        await signInWithEmailAndPassword(auth, emailLower, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Pogrešan email ili šifra.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Ovaj email se već koristi.');
      } else if (err.code === 'auth/weak-password') {
        setError('Šifra mora imati barem 6 karaktera.');
      } else {
        setError('Došlo je do greške: ' + err.message);
      }
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Molimo vas da prvo unesete svoju email adresu u polje iznad, pa onda kliknete na "Zaboravljena šifra?".');
      return;
    }
    
    const emailLower = email.toLowerCase().trim();
    if (!ALLOWED_EMAILS.includes(emailLower)) {
      setError('Ova email adresa nije prepoznata u sistemu.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailLower);
      setMessage(`Link za promenu šifre je poslat na ${emailLower}. Proverite svoj inbox (i spam folder).`);
    } catch (err: any) {
      setError('Greška prilikom slanja linka: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-placeholder">ZP</div>
          <h1>Zeppelin Pro ATS</h1>
          <p>{isRegister ? 'Prva prijava (Registracija)' : 'Prijavite se za pristup sistemu'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.2)'}}>{error}</div>}
          {message && <div className="login-message" style={{backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)'}}>{message}</div>}
          
          <div className="form-group">
            <label>Email adresa</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ime.prezime@zeppelin.rs"
              required 
            />
            {isRegister && <small style={{color: '#A0A5B1', marginTop: '4px', display: 'block'}}>Unesite vaš zvanični Zeppelin email (veljko, branislav, dusan ili zorica).</small>}
          </div>

          <div className="form-group">
            <label>Šifra</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Unesite šifru (min. 6 karaktera)"
              required={!isRegister || true}
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary login-submit-btn">
            {isRegister ? 'Završi registraciju' : 'Prijavi se'}
          </button>
        </form>

        <div className="login-toggle" style={{marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {!isRegister && (
            <button type="button" className="btn-text" onClick={handleResetPassword} style={{color: '#9ca3af', fontSize: '0.9rem'}}>
              Zaboravljena šifra?
            </button>
          )}
          <button type="button" className="btn-text" onClick={() => { setIsRegister(!isRegister); setError(''); setMessage(''); }}>
            {isRegister ? 'Već ste definisali šifru? Prijavite se' : 'Prvi put se prijavljujete? Definišite šifru ovde'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
