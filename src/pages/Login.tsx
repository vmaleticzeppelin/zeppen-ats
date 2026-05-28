import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-placeholder">ZP</div>
          <h1>Zeppelin Pro ATS</h1>
          <p>{isRegister ? 'Registracija novog naloga' : 'Prijavite se za pristup sistemu'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label>Email adresa</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="npr. admin@zeppelin.rs"
              required 
            />
            {isRegister && <small style={{color: '#A0A5B1', marginTop: '4px', display: 'block'}}>Koristite admin@..., branislav@... ili dusan@...</small>}
          </div>

          <div className="form-group">
            <label>Šifra</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Unesite šifru (min. 6 karaktera)"
              required 
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary login-submit-btn">
            {isRegister ? 'Registruj se' : 'Prijavi se'}
          </button>
        </form>

        <div className="login-toggle" style={{marginTop: '20px', textAlign: 'center'}}>
          <button type="button" className="btn-text" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Već imate nalog? Prijavite se' : 'Nemate nalog? Napravite ga ovde'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
