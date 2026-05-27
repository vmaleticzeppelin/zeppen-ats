import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// Struktura ocena jednog korisnika
export interface EvaluationData {
  scores: Record<string, number>;
  notes: Record<string, string>;
  redFlags: Record<string, string>;
  recommendation: string | null;
}

// Globalni store kandidata
interface CandidateEvaluations {
  [candidateId: string]: {
    Branislav?: EvaluationData;
    Dusan?: EvaluationData;
  };
}

interface EvalContextType {
  evaluations: CandidateEvaluations;
  saveEvaluation: (candidateId: string, evaluator: 'Branislav' | 'Dusan', data: EvaluationData) => Promise<void>;
  getEvaluation: (candidateId: string, evaluator: 'Branislav' | 'Dusan') => EvaluationData | undefined;
}

const EvalContext = createContext<EvalContextType | undefined>(undefined);

export const EvalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [evaluations, setEvaluations] = useState<CandidateEvaluations>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'evaluations'), (snapshot) => {
      const fetched: CandidateEvaluations = {};
      snapshot.forEach(doc => {
        fetched[doc.id] = doc.data() as any;
      });
      setEvaluations(fetched);
    });
    return () => unsub();
  }, []);

  const saveEvaluation = async (candidateId: string, evaluator: 'Branislav' | 'Dusan', data: EvaluationData) => {
    // Merge true allows us to just update Branislav's data without overwriting Dusan's
    await setDoc(doc(db, 'evaluations', String(candidateId)), {
      [evaluator]: data
    }, { merge: true });
  };

  const getEvaluation = (candidateId: string, evaluator: 'Branislav' | 'Dusan') => {
    return evaluations[candidateId]?.[evaluator];
  };

  return (
    <EvalContext.Provider value={{ evaluations, saveEvaluation, getEvaluation }}>
      {children}
    </EvalContext.Provider>
  );
};

export const useEvaluations = () => {
  const context = useContext(EvalContext);
  if (context === undefined) {
    throw new Error('useEvaluations must be used within an EvalProvider');
  }
  return context;
};
