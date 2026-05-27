import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { candidatesList as initialCandidates } from '../data/mockData';

export interface Candidate {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  status: string;
  score: number | null;
  appliedDate: string;
  source: string;
  cvUrl?: string;
  notes?: string;
}

interface CandidateContextType {
  candidates: Candidate[];
  addCandidate: (c: Omit<Candidate, 'id'>) => Promise<void>;
  updateCandidate: (id: string | number, data: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (id: string | number) => Promise<void>;
  getCandidateById: (id: string | number) => Candidate | undefined;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      if (snapshot.empty && !hasInitialized.current) {
        hasInitialized.current = true;
        // Ako je baza potpuno prazna, napunimo je početnim test podacima
        initialCandidates.forEach(async (c) => {
          const { id, ...rest } = c;
          await addDoc(collection(db, 'candidates'), rest);
        });
      } else {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Candidate[];
        setCandidates(fetched);
      }
    });
    return () => unsub();
  }, []);

  const addCandidate = async (c: Omit<Candidate, 'id'>) => {
    await addDoc(collection(db, 'candidates'), c);
  };

  const updateCandidate = async (id: string | number, data: Partial<Candidate>) => {
    await updateDoc(doc(db, 'candidates', String(id)), data);
  };

  const deleteCandidate = async (id: string | number) => {
    await deleteDoc(doc(db, 'candidates', String(id)));
  };

  const getCandidateById = (id: string | number) => {
    return candidates.find(c => String(c.id) === String(id));
  };

  return (
    <CandidateContext.Provider value={{ candidates, addCandidate, updateCandidate, deleteCandidate, getCandidateById }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error('useCandidates must be used within a CandidateProvider');
  }
  return context;
};
