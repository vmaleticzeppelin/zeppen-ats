import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import './AddCandidateModal.css';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: any) => void;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: Date.now(),
      name: formData.name || 'Novi Kandidat',
      email: formData.email || '-',
      phone: formData.phone || '-',
      status: 'Neocenjen',
      score: null,
      appliedDate: new Date().toLocaleDateString('sr-RS'),
      source: formData.source,
      cvUrl: formData.cvUrl
    });
    setFormData({ name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: '' });
    setStep(1);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>Dodaj Novog Kandidata</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-body">
          <div className="modal-tabs">
            <button className={`m-tab ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>1. Osnovni podaci</button>
            <button className={`m-tab ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}>2. Dodatne informacije</button>
          </div>

          {step === 1 && (
            <div className="modal-form-grid">
              <div className="input-group">
                <label>Ime i Prezime *</label>
                <input type="text" placeholder="Unesite ime i prezime" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Email *</label>
                <input type="email" placeholder="email@primer.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Telefon *</label>
                <input type="text" placeholder="06x/xxx-xxxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Grad</label>
                <input type="text" placeholder="Npr. Beograd" />
              </div>
              <div className="input-group">
                <label>Datum rođenja</label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>LinkedIn Profil</label>
                <input type="url" placeholder="https://linkedin.com/in/..." />
              </div>
              
              <div className="input-group full-width">
                <label>CV Upload</label>
                <div className="file-upload-box">
                  <Upload size={24} className="upload-icon" />
                  <p>{formData.cvUrl ? "CV uspešno dodat (kliknite za promenu)" : "Kliknite ovde ili prevucite fajl (PDF, DOCX)"}</p>
                  <input type="file" className="file-input-hidden" accept=".pdf,.doc,.docx" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const url = URL.createObjectURL(file);
                      setFormData({...formData, cvUrl: url});
                    }
                  }} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="modal-form-grid">
              <div className="input-group">
                <label>Prethodno iskustvo (Godine)</label>
                <select>
                  <option>Bez iskustva</option>
                  <option>Manje od 1 godine</option>
                  <option>1 - 3 godine</option>
                  <option>3 - 5 godina</option>
                  <option>Više od 5 godina</option>
                </select>
              </div>
              <div className="input-group">
                <label>Poslednja firma</label>
                <input type="text" placeholder="Ime firme" />
              </div>
              <div className="input-group full-width">
                <label>Razlog promene posla</label>
                <textarea rows={2} placeholder="Kratko objašnjenje..."></textarea>
              </div>
              <div className="input-group">
                <label>Očekivana plata</label>
                <input type="text" placeholder="Npr. 120.000 RSD" />
              </div>
              <div className="input-group">
                <label>Dostupnost za početak rada</label>
                <select>
                  <option>Odmah</option>
                  <option>Za 2 nedelje</option>
                  <option>Za mesec dana</option>
                </select>
              </div>
              <div className="input-group">
                <label>Izvor prijave</label>
                <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                  <option value="Infostud">Infostud</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Sajt kompanije">Sajt kompanije</option>
                  <option value="Preporuka">Preporuka</option>
                  <option value="Ostalo">Ostalo</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Odustani</button>
          {step === 1 ? (
             <button className="btn-primary" onClick={() => setStep(2)}>Sledeći korak</button>
          ) : (
             <button className="btn-primary" onClick={handleSave}>Sačuvaj Kandidata</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
