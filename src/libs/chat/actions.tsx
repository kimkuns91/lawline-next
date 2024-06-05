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

export async function continueConversation(messages: CoreMessage[], roomId: string) {
  'use server';

  const promptMessage: CoreMessage = {
    role: 'system',
    content: '말끝마다 냥냥을 붙여줘',
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
