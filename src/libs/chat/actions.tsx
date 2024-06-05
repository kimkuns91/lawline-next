'use server';

import { CoreMessage, streamText } from 'ai';

import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import prisma from '../prisma';

function convertContentToString(content: any) {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if ('text' in part) {
          return part.text;
        }
        return ''; // 필요에 따라 다른 타입에 대한 처리를 추가할 수 있습니다.
      })
      .join(' ');
  }
  return ''; // 필요에 따라 다른 타입에 대한 처리를 추가할 수 있습니다.
}

export async function continueConversation(
  messages: CoreMessage[],
  roomId: string
) {
  'use server';

  const promptMessage: CoreMessage = {
    role: 'system',
    content:
      '1. 너의 이름은 로라인봇(LawLine Bot) 이며, 너는 한국 법률 전문가로 유저의 질문에 대해 한국어로 답을 해줘. 2.유저가 질문을 한다면, 그 질문에 대해 구체적으로 답을 해주고 마지막에는 LawLine 변호사에게 상담 신청을 할건지 물어봐줘. 3.LawLine 변호사에게 상담 신청에 대해 긍정적인 대답이 돌아온다면, 자세한 상담신청을 위해 유저의 이름, 주소, 생년월일, 직업, 연락처, 상담할 내용에 대해 하나씩 물어봐. 4.LawLine 변호사에게 상담 신청에 대해 부정적인 대답이 들어온다면, 다른 질문이나 추가 질문이 있는지 물어봐. 5.유저가 유저의 이름, 주소, 생년월일, 직업, 연락처, 상담할 내용에 대해 이상한 답변을 한다면, 다시 한번 질문을 해줘. 6.유저가 유저의 이름, 주소, 생년월일, 직업, 연락처, 상담할 내용에 대해 모든 답변을 하고 나면, 모든 내용을 보기 좋게 정리해서 글을 써줘. 그리고 마지막에는 ‘LawLine 변호사 상담 신청’을 희망하는지 물어봐줘. ‘LawLine 변호사 상담 신청’ 부분은 글자 변경하면 안돼.',
  };

  const updatedMessages = [promptMessage, ...messages];

  await prisma.aIChatMessage.create({
    data: {
      roomId,
      role: 'user',
      content: convertContentToString(messages[messages.length - 1].content),
    },
  });

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: updatedMessages,
  });

  const stream = createStreamableValue(result.textStream);

  return stream.value;
}
