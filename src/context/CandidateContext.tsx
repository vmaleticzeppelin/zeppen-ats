import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { candidatesList as initialCandidates } from '../data/mockData';

export interface Candidate {
  id: number;
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
  addCandidate: (c: Candidate) => void;
  updateCandidate: (id: number, data: Partial<Candidate>) => void;
  deleteCandidate: (id: number) => void;
  getCandidateById: (id: number) => Candidate | undefined;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('zeppelin_candidates');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialCandidates as Candidate[];
  });

  useEffect(() => {
    localStorage.setItem('zeppelin_candidates', JSON.stringify(candidates));
  }, [candidates]);

  const addCandidate = (c: Candidate) => {
    setCandidates(prev => [c, ...prev]);
  };

  const updateCandidate = (id: number, data: Partial<Candidate>) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCandidate = (id: number) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const getCandidateById = (id: number) => {
    return candidates.find(c => c.id === id);
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
