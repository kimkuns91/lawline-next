'use client';

import { continueConversation } from '@/libs/chat/actions';
import { cn } from '@/utils/style';
import { type CoreMessage } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
;

import ChatMessage from './ChatMessage';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface ChatRoomProps {
  roomId?: string | null;
  userId?: string | null;
  setRoomId: (value: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({

  roomId,
  userId,
  setRoomId,
}) => {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    (async () => {
      if (roomId) {
        try {
          const result = await axios.get(`/api/room/${roomId}`);
          setMessages(result.data);
        } catch (error) {
          console.error('Error fetching chat Fmessages:', error);
        }
      }
    })();
  }, [roomId]);

  const createRoomIfNeeded = async (
    input: string
  ): Promise<string | null | undefined> => {
    if (!roomId) {
      const result = await axios.post('/api/room', { input, userId });
      const newRoomId = result.data.id;
      if (!newRoomId) {
        console.error('Room ID is required');
        return null;
      }
      setRoomId(newRoomId);
      let rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
      if (!Array.isArray(rooms)) {
        rooms = [];
      }
      rooms.push({ roomId: newRoomId, title: input });
      localStorage.setItem('rooms', JSON.stringify(rooms));
      return newRoomId;
    }
    return roomId;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) { // 입력 값이 없으면 함수 종료
      return;
    }

    setIsSending(true); // 메시지 전송 상태로 설정

    const currentRoomId = await createRoomIfNeeded(input);

    if (!currentRoomId) {
      setIsSending(false);
      return;
    }

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];

    setMessages(newMessages);
    setInput('');

    const result = await continueConversation(newMessages, currentRoomId);
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
        roomId: currentRoomId,
      });
      console.log('Messages saved to the server');
    } catch (error) {
      console.error('Error saving messages to the server:', error);
    }

    setIsSending(false); // 메시지 전송 완료 후 상태 초기화
  };

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
        {messages.map((m, i) => (
          <div key={i}>
            <ChatMessage role={m.role} content={m.content as string} />
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

export default ChatRoom;
