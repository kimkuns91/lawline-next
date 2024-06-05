import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, roomId } = body;
    
    const assistantMessage = await prisma.aIChatMessage.create({
      data: {
        roomId: roomId, // 필요한 경우 roomId를 동적으로 설정
        role: messages.role,
        content: messages.content,
      },
    });

    return NextResponse.json(
      {
        message: '성공',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.error();
  }
}
