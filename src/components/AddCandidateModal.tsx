import React, { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import './AddCandidateModal.css';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: any) => void;
  initialData?: any;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: '', interviewDate: '', address: '', birthDate: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          source: initialData.source || 'LinkedIn',
          cvUrl: initialData.cvUrl || '',
          interviewDate: initialData.interviewDate || '',
          address: initialData.address || '',
          birthDate: initialData.birthDate || ''
        });
      } else {
        setFormData({ name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: '', interviewDate: '', address: '', birthDate: '' });
      }
      setStep(1);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...(initialData ? { id: initialData.id, status: initialData.status, score: initialData.score, appliedDate: initialData.appliedDate } : {
        status: 'Neocenjen',
        score: null,
        appliedDate: new Date().toLocaleDateString('sr-RS'),
      }),
      name: formData.name || 'Novi Kandidat',
      email: formData.email || '-',
      phone: formData.phone || '-',
      source: formData.source,
      cvUrl: formData.cvUrl,
      interviewDate: formData.interviewDate,
      address: formData.address,
      birthDate: formData.birthDate
    });
    setFormData({ name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: '', interviewDate: '', address: '', birthDate: '' });
    setStep(1);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>{initialData ? 'Izmeni Kandidata' : 'Dodaj Novog Kandidata'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-body">
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
                <label>Adresa kandidata</label>
                <input type="text" placeholder="Npr. Ulica i broj, Grad" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Datum rođenja</label>
                <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Zakazan razgovor (Datum i vreme)</label>
                <input type="datetime-local" value={formData.interviewDate} onChange={e => setFormData({...formData, interviewDate: e.target.value})} />
              </div>
              
              <div className="input-group full-width">
                <label>Link do CV-ja (Google Drive, Dropbox, LinkedIn...)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid #383D47', padding: '0.8rem', borderRadius: '8px' }}>
                  <LinkIcon size={20} color="#A0A5B1" />
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
                    value={formData.cvUrl} 
                    onChange={e => setFormData({...formData, cvUrl: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Odustani</button>
          <button className="btn-primary" onClick={handleSave}>{initialData ? 'Sačuvaj Izmene' : 'Sačuvaj Kandidata'}</button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
