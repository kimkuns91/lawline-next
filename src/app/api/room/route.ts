import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, userId } = body;

    const newRoom = await prisma.aIChatRoom.create({
      data: {
        title: input,
        userId: userId || 'unknown', // 필요한 경우 roomId를 동적으로 설정
      },
    });

    return NextResponse.json(newRoom, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}
