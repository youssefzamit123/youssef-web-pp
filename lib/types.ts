export type UserRole = 'Médecin' | 'Radiologue' | 'Admin' | 'Patient';
export type RiskLevel = 'Élevé' | 'Modéré' | 'Faible';
export type AppPage = 'landing' | 'login' | 'home' | 'patient-detail' | 'patient-dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  cin: string;
  reference: string;
  riskScore: number;
  riskLevel: RiskLevel;
  lastVisit: string;
  dateOfBirth?: string;
  phone?: string;
  medicalHistory?: string;
  doctor?: string;
  insurance?: string;
}

export interface CariesDetection {
  toothNumber: number;
  location: string;
  confidence: number;
}

export interface RiskPrediction {
  metric: string;
  percentage: number;
  color: 'high' | 'medium' | 'low';
}

export interface ActivityFeedItem {
  id: string;
  type: 'analysis' | 'upload' | 'update';
  description: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: 'confirmé' | 'en attente' | 'annulé';
}

export interface AppContextType {
  currentPage: AppPage;
  user: User | null;
  selectedPatient: Patient | null;
  setCurrentPage: (page: AppPage) => void;
  setUser: (user: User | null) => void;
  setSelectedPatient: (patient: Patient | null) => void;
}
