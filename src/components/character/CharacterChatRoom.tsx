import { useEffect, useState } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

import { continueConversationWithAiModel } from '@/libs/chat/actions';
import { cn } from '@/utils/style';
import { AIModel } from '@prisma/client';
import { CoreMessage } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import axios from 'axios';
import CharacterMessage from './CharacterMessage';

interface CharacterChatRoomProps {
  userId?: string;
  character: AIModel;
}

const CharacterChatRoom: React.FC<CharacterChatRoomProps> = ({
  userId,
  character,
}) => {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const roomIdResult = await axios.post('/api/room', {
          input: character.name,
          userId,
        });
        setRoomId(roomIdResult.data.id);
      } catch (error) {
        console.error('Error fetching character:', error);
      }
    })();
  }, [userId, character]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      // 입력 값이 없으면 함수 종료
      return;
    }

    setIsSending(true); // 메시지 전송 상태로 설정

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];

    setMessages(newMessages);
    setInput('');

    const result = await continueConversationWithAiModel(
      character?.prompt!,
      newMessages,
      roomId!
    );
    let finalContent = '';

    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: content as string,
        },
      ]);
      finalContent = content as string;
    }

    try {
      await axios.post('/api/chat', {
        messages: { role: 'assistant', content: finalContent },
        roomId,
      });
      console.log('Messages saved to the server');
    } catch (error) {
      console.error('Error saving messages to the server:', error);
    }

    setIsSending(false); // 메시지 전송 완료 후 상태 초기화
  };

  if (!character) return 'loading';

  return (
    <div
      className={cn(
        'size-full',
        'max-w-[800px] mx-auto',
        'flex flex-col relative',
        'px-28 py-6'
      )}
    >
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
        <CharacterMessage
          role={'assistant'}
          content={character.greeting}
          character={character}
        />
        {messages.map((m, i) => (
          <div key={i}>
            <CharacterMessage
              role={m.role}
              content={m.content as string}
              character={character}
            />
          </div>
        ))}
      </div>

      <form className="mb-8 w-full" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between rounded-full border border-slate-300 px-6 py-2 shadow-xl">
          <input
            className="flex-1 bg-transparent p-2 text-slate-900 placeholder:text-gray-500 focus:outline-none"
            value={input}
            placeholder="LawLine AI 봇에게 법률에 대해 물어보세요."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className={cn(
              'ml-4 p-2',
              isSending ? 'opacity-50 cursor-not-allowed' : 'text-slate-700'
            )}
            disabled={isSending || !input.trim()} // 메시지 전송 중이거나 입력 값이 없으면 비활성화
          >
            {isSending ? (
              <FaSpinner className="animate-spin text-slate-700" /> // 로딩 스피너 아이콘
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CharacterChatRoom;
