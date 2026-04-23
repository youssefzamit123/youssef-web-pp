import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

type Reward = {
  id: string;
  title: string;
  cost: number;
  role: 'kid' | 'adult';
  description: string;
};

const REWARDS: Reward[] = [
  {
    id: 'kid_sticker_pack',
    title: 'Pack stickers sourire',
    cost: 50,
    role: 'kid',
    description: 'De super stickers offerts à ta prochaine visite !',
  },
  {
    id: 'kid_toothbrush',
    title: 'Brosse à dents héros',
    cost: 150,
    role: 'kid',
    description: 'Choisis ta brosse à dents Héros chez ton dentiste !',
  },
  {
    id: 'kid_surprise_box',
    title: 'La boîte Magique',
    cost: 300,
    role: 'kid',
    description: 'Un merveilleux jouet mystère rien que pour toi !',
  },
  {
    id: 'adult_discount_5',
    title: 'Reduction 5%',
    cost: 60,
    role: 'adult',
    description: 'Reduction sur le prochain rendez-vous',
  },
  {
    id: 'adult_discount_10',
    title: 'Reduction 10%',
    cost: 120,
    role: 'adult',
    description: 'Reduction premium fidelite',
  },
  {
    id: 'adult_priority_slot',
    title: 'Creneau prioritaire',
    cost: 160,
    role: 'adult',
    description: 'Priorite de reservation',
  },
];

type LoyaltyPayload = {
  patientEmail?: string;
  action?: 'heartbeat' | 'collect';
  minutes?: number;
  rewardId?: string;
};

function resolveRole(age?: number) {
  if (!age || age < 13) return 'kid' as const;
  return 'adult' as const;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientEmail = searchParams.get('patientEmail')?.toLowerCase();

  if (!patientEmail) {
    return NextResponse.json({ error: 'patientEmail requis' }, { status: 400 });
  }

  const db = await readDatabase();
  const patient = db.patients.find(p => p.patientEmail.toLowerCase() === patientEmail);
  if (!patient) {
    return NextResponse.json({ error: 'Patient introuvable' }, { status: 404 });
  }

  const role = resolveRole(patient.age);

  let profile = db.loyalty.find(l => l.patientEmail.toLowerCase() === patientEmail);
  if (!profile) {
    profile = {
      patientEmail,
      role,
      points: 0,
      minutesSpent: 0,
      collectedRewards: [],
    };
    db.loyalty.push(profile);
    await writeDatabase(db);
  }

  const availableRewards = REWARDS.filter(reward => reward.role === profile.role);

  return NextResponse.json({
    profile,
    availableRewards,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoyaltyPayload;
    const patientEmail = body.patientEmail?.toLowerCase();

    if (!patientEmail || !body.action) {
      return NextResponse.json({ error: 'Requete invalide' }, { status: 400 });
    }

    const db = await readDatabase();
    const patient = db.patients.find(p => p.patientEmail.toLowerCase() === patientEmail);
    if (!patient) {
      return NextResponse.json({ error: 'Patient introuvable' }, { status: 404 });
    }

    const role = resolveRole(patient.age);
    let profile = db.loyalty.find(l => l.patientEmail.toLowerCase() === patientEmail);

    if (!profile) {
      profile = {
        patientEmail,
        role,
        points: 0,
        minutesSpent: 0,
        collectedRewards: [],
      };
      db.loyalty.push(profile);
    }

    if (body.action === 'heartbeat') {
      const minutes = Math.max(1, Math.min(10, Number(body.minutes || 1)));
      const multiplier = profile.role === 'kid' ? 4 : 2;
      const earned = minutes * multiplier;

      profile.minutesSpent += minutes;
      profile.points += earned;
      profile.lastHeartbeatAt = new Date().toISOString();

      await writeDatabase(db);

      return NextResponse.json({
        success: true,
        earned,
        profile,
        availableRewards: REWARDS.filter(reward => reward.role === profile.role),
      });
    }

    if (body.action === 'collect') {
      const reward = REWARDS.find(r => r.id === body.rewardId && r.role === profile.role);
      if (!reward) {
        return NextResponse.json({ error: 'Recompense introuvable' }, { status: 404 });
      }

      if (profile.collectedRewards.includes(reward.id)) {
        return NextResponse.json({ error: 'Recompense deja recuperee' }, { status: 409 });
      }

      if (profile.points < reward.cost) {
        return NextResponse.json({ error: 'Points insuffisants' }, { status: 400 });
      }

      profile.points -= reward.cost;
      profile.collectedRewards.push(reward.id);

      await writeDatabase(db);

      return NextResponse.json({
        success: true,
        reward,
        profile,
        availableRewards: REWARDS.filter(r => r.role === profile.role),
      });
    }

    return NextResponse.json({ error: 'Action non supportee' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Requete invalide' }, { status: 400 });
  }
}
