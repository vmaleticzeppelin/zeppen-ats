import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import './AddCandidateModal.css';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: any) => void;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: '', interviewDate: ''
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsUploading(true);
    let finalCvUrl = formData.cvUrl;

    try {
      if (selectedFile) {
        const fileRef = ref(storage, `cvs/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(fileRef, selectedFile);
        finalCvUrl = await getDownloadURL(snapshot.ref);
      }

      onSave({
        name: formData.name || 'Novi Kandidat',
        email: formData.email || '-',
        phone: formData.phone || '-',
        status: 'Neocenjen',
        score: null,
        appliedDate: new Date().toLocaleDateString('sr-RS'),
        source: formData.source,
        cvUrl: finalCvUrl,
        interviewDate: formData.interviewDate
      });
      
      setFormData({ name: '', email: '', phone: '', source: 'LinkedIn', cvUrl: '', interviewDate: '' });
      setSelectedFile(null);
      setStep(1);
      onClose();
    } catch (error) {
      console.error("Greška pri uploadu CV-ja:", error);
      alert("Došlo je do greške prilikom uploada CV-ja. Proverite dozvole (Rules) za Firebase Storage.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h2>Dodaj Novog Kandidata</h2>
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
                <input type="text" placeholder="Npr. Ulica i broj, Grad" />
              </div>
              <div className="input-group">
                <label>Datum rođenja</label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>Zakazan razgovor (Datum i vreme)</label>
                <input type="datetime-local" value={formData.interviewDate} onChange={e => setFormData({...formData, interviewDate: e.target.value})} />
              </div>
              
              <div className="input-group full-width">
                <label>CV Upload</label>
                <div className="file-upload-box">
                  <Upload size={24} className="upload-icon" />
                  <p>{selectedFile ? `CV izabran: ${selectedFile.name}` : "Kliknite ovde ili prevucite fajl (PDF, DOCX)"}</p>
                  <input type="file" className="file-input-hidden" accept=".pdf,.doc,.docx" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isUploading}>Odustani</button>
          <button className="btn-primary" onClick={handleSave} disabled={isUploading}>
            {isUploading ? 'Snimanje...' : 'Sačuvaj Kandidata'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
