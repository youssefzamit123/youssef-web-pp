import type { User, Patient, CariesDetection, RiskPrediction, ActivityFeedItem, Appointment } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Rami Benayed',
    email: 'rami@dentai.com',
    role: 'Médecin',
    avatar: 'RB',
  },
  {
    id: '4',
    name: 'Ahmed Slaimi',
    email: 'ahmed.slaimi@email.com',
    role: 'Patient',
    avatar: 'AS',
  },
];

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Ahmed Slaimi',
    age: 34,
    gender: 'M',
    cin: '12345678',
    reference: 'REF001',
    riskScore: 78,
    riskLevel: 'Élevé',
    lastVisit: '2024-03-15',
    dateOfBirth: '1990-05-12',
    phone: '+216 91 234 567',
    medicalHistory: 'Diabète',
    doctor: 'Dr. Rami Benayed',
    insurance: 'CNAM',
  },
  {
    id: 'p2',
    name: 'Leïla Tabbabi',
    age: 28,
    gender: 'F',
    cin: '87654321',
    reference: 'REF002',
    riskScore: 45,
    riskLevel: 'Modéré',
    lastVisit: '2024-03-10',
    dateOfBirth: '1996-08-22',
    phone: '+216 92 345 678',
    medicalHistory: 'Aucune',
    doctor: 'Dr. Rami Benayed',
    insurance: 'CNAM',
  },
  {
    id: 'p3',
    name: 'Mohamed Khalil',
    age: 52,
    gender: 'M',
    cin: '11223344',
    reference: 'REF003',
    riskScore: 62,
    riskLevel: 'Modéré',
    lastVisit: '2024-03-08',
    dateOfBirth: '1972-01-15',
    phone: '+216 93 456 789',
    medicalHistory: 'Hypertension',
    doctor: 'Dr. Rami Benayed',
    insurance: 'AMI',
  },
  {
    id: 'p4',
    name: 'Nida Mansouri',
    age: 41,
    gender: 'F',
    cin: '44556677',
    reference: 'REF004',
    riskScore: 25,
    riskLevel: 'Faible',
    lastVisit: '2024-03-12',
    dateOfBirth: '1983-11-08',
    phone: '+216 94 567 890',
    medicalHistory: 'Aucune',
    doctor: 'Dr. Rami Benayed',
    insurance: 'CNAM',
  },
];

export const mockCariesDetection: CariesDetection[] = [
  { toothNumber: 16, location: 'Occlusal', confidence: 89 },
  { toothNumber: 26, location: 'Interproximal', confidence: 76 },
  { toothNumber: 36, location: 'Cervical', confidence: 92 },
  { toothNumber: 46, location: 'Occlusal', confidence: 85 },
];

export const mockRiskPredictions: RiskPrediction[] = [
  { metric: 'Carie avancée', percentage: 78, color: 'high' },
  { metric: 'Risque parodontal', percentage: 45, color: 'medium' },
  { metric: 'Hypersensibilité', percentage: 30, color: 'low' },
];

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: 'a1',
    type: 'analysis',
    description: 'Analyse IA complétée pour Ahmed Slaimi',
    timestamp: '2024-03-15 14:30',
  },
  {
    id: 'a2',
    type: 'upload',
    description: 'Radiographie importée pour Leïla Tabbabi',
    timestamp: '2024-03-15 13:45',
  },
  {
    id: 'a3',
    type: 'update',
    description: 'Dossier patient mis à jour pour Mohamed Khalil',
    timestamp: '2024-03-15 11:20',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    date: '2024-04-02',
    time: '09:30',
    doctor: 'Dr. Rami Benayed',
    type: 'Contrôle routine',
    status: 'confirmé',
  },
  {
    id: 'apt2',
    date: '2024-04-10',
    time: '14:00',
    doctor: 'Dr. Fatima Zahra',
    type: 'Radiographie panoramique',
    status: 'en attente',
  },
  {
    id: 'apt3',
    date: '2024-04-18',
    time: '11:00',
    doctor: 'Dr. Rami Benayed',
    type: 'Suivi traitement',
    status: 'confirmé',
  },
];
