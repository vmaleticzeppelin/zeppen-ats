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
    Admin?: EvaluationData;
    Branislav_r2?: EvaluationData;
    Dusan_r2?: EvaluationData;
    Admin_r2?: EvaluationData;
  };
}

export type EvaluatorRole = 'Branislav' | 'Dusan' | 'Admin';

interface EvalContextType {
  evaluations: CandidateEvaluations;
  saveEvaluation: (candidateId: string, evaluator: EvaluatorRole, data: EvaluationData, round?: number) => Promise<void>;
  getEvaluation: (candidateId: string, evaluator: EvaluatorRole, round?: number) => EvaluationData | undefined;
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

  const saveEvaluation = async (candidateId: string, evaluator: EvaluatorRole, data: EvaluationData, round: number = 1) => {
    // Merge true allows us to just update Branislav's data without overwriting Dusan's
    const key = round === 1 ? evaluator : `${evaluator}_r2`;
    await setDoc(doc(db, 'evaluations', String(candidateId)), {
      [key]: data
    }, { merge: true });
  };

  const getEvaluation = (candidateId: string, evaluator: EvaluatorRole, round: number = 1) => {
    const key = round === 1 ? evaluator : `${evaluator}_r2`;
    return (evaluations[candidateId] as any)?.[key];
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
