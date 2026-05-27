import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

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
  saveEvaluation: (candidateId: string, evaluator: 'Branislav' | 'Dusan', data: EvaluationData) => void;
  getEvaluation: (candidateId: string, evaluator: 'Branislav' | 'Dusan') => EvaluationData | undefined;
}

const EvalContext = createContext<EvalContextType | undefined>(undefined);

export const EvalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [evaluations, setEvaluations] = useState<CandidateEvaluations>({});

  const saveEvaluation = (candidateId: string, evaluator: 'Branislav' | 'Dusan', data: EvaluationData) => {
    setEvaluations(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [evaluator]: data
      }
    }));
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
