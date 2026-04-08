import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ActivityFeedItem, Appointment, Patient, User, UserRole } from './types';

type DoctorRecord = {
  id: string;
  name: string;
  city: string;
  specialty: string;
  phone: string;
  email: string;
};

type ChatRecord = {
  id: string;
  doctorId: string;
  patientEmail: string;
  from: 'patient' | 'doctor';
  text: string;
  timestamp: string;
};

type AppointmentRecord = Appointment & {
  doctorId: string;
  patientEmail: string;
  location: string;
};

type PatientRecord = Patient & {
  patientEmail: string;
};

type DatabaseData = {
  users: User[];
  doctors: DoctorRecord[];
  patients: PatientRecord[];
  appointments: AppointmentRecord[];
  chats: ChatRecord[];
  activityFeed: ActivityFeedItem[];
};

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

async function ensureDatabaseFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const initialData: DatabaseData = {
      users: [],
      doctors: [],
      patients: [],
      appointments: [],
      chats: [],
      activityFeed: [],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

export async function readDatabase(): Promise<DatabaseData> {
  await ensureDatabaseFile();
  const file = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(file) as DatabaseData;
}

export async function writeDatabase(data: DatabaseData) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export function calcAge(dateOfBirth?: string) {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

export type { DatabaseData, DoctorRecord, AppointmentRecord, ChatRecord, PatientRecord };
