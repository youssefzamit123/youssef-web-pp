import { NextResponse } from 'next/server';
import { makeId, readDatabase, writeDatabase } from '@/lib/database';
import type { User, DoctorAccountRequest } from '@/lib/types';

export async function GET() {
  try {
    const db = await readDatabase();
    const requests = db.doctorRequests.filter(r => r.status === 'pending');
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { id, action } = payload;

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const db = await readDatabase();
    const reqIndex = db.doctorRequests.findIndex(r => r.id === id);

    if (reqIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const req = db.doctorRequests[reqIndex];
    req.status = action === 'approve' ? 'approved' : 'rejected';

    if (action === 'approve') {
      const newUser: User = {
        id: makeId('user'),
        name: req.name,
        email: req.email,
        role: 'Médecin',
        avatar: `${req.name.charAt(0)}${req.name.split(' ')[1]?.[0] || ''}`.toUpperCase(),
        dateOfBirth: '',
        localisation: '',
        relations: '',
        isKid: false
      };
      
      if (!db.users.find(u => u.email === newUser.email)) {
        db.users.push(newUser);
      }

      const docExists = db.doctors.find((d: any) => d.name === req.name);
      if (!docExists) {
        db.doctors.push({
          id: makeId('dr'),
          name: req.name,
          city: '',
          specialty: req.specialty || 'Dentiste',
          phone: '',
          email: req.email
        });
      }
    }

    await writeDatabase(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
