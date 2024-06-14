'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/utils/style';
import { AIChatRoom } from '@prisma/client';
import { CoreMessage } from 'ai';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import ChatMessage from './ChatMessage';
import Spinner from './Spinner';

interface ChatRoomProps {
  roomId?: string | null;
  userId?: string | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [roomInfo, setRoomInfo] = useState<AIChatRoom | null>(null);
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

  return (
    <div className={cn('size-full')}>
      <div
        className={cn(
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
        <form className="mb-8 w-full" onSubmit={() => {}}>
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
                <Spinner /> // 로딩 스피너 아이콘
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
