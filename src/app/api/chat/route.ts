import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    console.log('requestMessage:', message); 
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