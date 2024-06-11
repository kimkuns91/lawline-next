import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterId } = body;

    console.log('characterId:', characterId);
    
    const character = await prisma.aIModel.findUnique({
      where: {
        id: characterId,
      },
    });

    return NextResponse.json(character, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}
