const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

if (!code.includes('games: GameRecord[];')) {
  code = code.replace('type LoyaltyRecord = {', 
`type GameRecord = {
  id: string;
  type: string;
  title: string;
  description: string;
  difficulty?: string;
  targetColor?: number;
  memoryTarget?: number;
  quizQuestions?: Array<{question: string, options: string[], correct: number}>;
  rewards: {stars: number, points: number};
};

type RewardConfig = {
  id: string;
  title: string;
  cost: number;
  description: string;
  targetRole: 'kid' | 'adult';
};

type ToothStatus = 'healthy' | 'caries' | 'treated' | 'missing' | 'implant' | 'to-extract';

type ToothData = {
  number: number;
  status: ToothStatus;
  notes: string;
  aiConfidence?: number;
};

type DentalRecord = {
  id: string;
  patientEmail: string;
  lastUpdate: string;
  teeth: ToothData[];
};

type LoyaltyRecord = {`);

  code = code.replace('loyalty: LoyaltyRecord[];', 'loyalty: LoyaltyRecord[];\n  games: GameRecord[];\n  rewardConfigs: RewardConfig[];\n  dentalRecords: DentalRecord[];\n  doctorRequests: DoctorAccountRequest[];');
  
  code = code.replace('loyalty: [],', 'loyalty: [],\n      games: [],\n      rewardConfigs: [],\n      dentalRecords: [],\n      doctorRequests: [],');
  
  code = code.replace('loyalty: parsed.loyalty || [],', 'loyalty: parsed.loyalty || [],\n    games: parsed.games || [],\n    rewardConfigs: parsed.rewardConfigs || [],\n    dentalRecords: parsed.dentalRecords || [],\n    doctorRequests: parsed.doctorRequests || [],');
  
  code = code.replace('export type { DatabaseData', 'export type { DatabaseData, GameRecord, RewardConfig, DentalRecord, ToothData, ToothStatus');
}

fs.writeFileSync('lib/database.ts', code);
console.log('Fixed db');