'use server';

import { CoreMessage, streamText } from 'ai';

import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export async function continueConversation(messages: CoreMessage[]) {
  'use server';
  console.log('userMessage:', messages);
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });
console.log('result:', result); 
  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
