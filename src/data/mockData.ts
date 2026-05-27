export const statsData = {
  activeCandidates: 24,
  inProcess: 12,
  finalRound: 4,
  hired: 2,
  rejected: 8,
  trial: 1
};

export const pipelineData = [
  { name: 'Novi', value: 45 },
  { name: 'Prvi krug', value: 30 },
  { name: 'Drugi krug', value: 15 },
  { name: 'Probni rad', value: 5 },
  { name: 'Zaposleni', value: 2 },
];

export const topCandidates = [
  { id: 1, name: 'Marko Marković', score: 92, phase: 'Drugi krug', status: 'active' },
  { id: 2, name: 'Jelena Jović', score: 88, phase: 'Prvi krug', status: 'active' },
  { id: 3, name: 'Nikola Nikolić', score: 85, phase: 'Probni rad', status: 'trial' },
  { id: 4, name: 'Ana Anić', score: 81, phase: 'Novi', status: 'new' },
];

export const scoreRadarData = [
  { subject: 'Energija', A: 90, fullMark: 100 },
  { subject: 'Organizacija', A: 85, fullMark: 100 },
  { subject: 'Komunikacija', A: 95, fullMark: 100 },
  { subject: 'Stabilnost', A: 80, fullMark: 100 },
  { subject: 'Prodaja', A: 88, fullMark: 100 },
  { subject: 'Disciplina', A: 82, fullMark: 100 },
];

export const candidatesList = [
  { id: 1, name: 'Marko Marković', email: 'marko@example.com', phone: '060/123-4567', status: 'Drugi krug završen', score: 92, appliedDate: '25.10.2023', source: 'LinkedIn' },
  { id: 2, name: 'Jelena Jović', email: 'jelena@example.com', phone: '061/987-6543', status: 'Zakazan prvi razgovor', score: 88, appliedDate: '26.10.2023', source: 'Infostud' },
  { id: 3, name: 'Nikola Nikolić', email: 'nikola@example.com', phone: '062/555-4444', status: 'Probni rad', score: 85, appliedDate: '15.10.2023', source: 'Preporuka' },
  { id: 4, name: 'Ana Anić', email: 'ana@example.com', phone: '063/111-2222', status: 'Novi kandidat', score: null, appliedDate: '27.10.2023', source: 'Sajt' },
  { id: 5, name: 'Petar Petrović', email: 'petar@example.com', phone: '064/333-1111', status: 'Odbijen nakon prvog kruga', score: 45, appliedDate: '20.10.2023', source: 'LinkedIn' },
];
