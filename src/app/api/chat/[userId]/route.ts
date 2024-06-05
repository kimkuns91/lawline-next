import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const rooms = await prisma.aIChatRoom.findMany({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}