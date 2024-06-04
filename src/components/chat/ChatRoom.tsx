'use client';

import { continueConversation } from '@/libs/chat/actions';
import { cn } from '@/utils/style';
import { type CoreMessage } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { TbMinusVertical } from 'react-icons/tb';
import ChatMessage from './ChatMessage';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface ChatRoomProps {
  isSidebarVisible: boolean;
  setIsSidebarVisible: (value: boolean) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  isSidebarVisible,
  setIsSidebarVisible,
}) => {
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  useEffect(() => {
    console.log('messages:', messages); 
  }, [messages]);

  const [input, setInput] = useState('');

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSubmit = async () => {
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];

    setMessages(newMessages);
    setInput('');

    const result = await continueConversation(newMessages);

    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: content as string,
        },
      ]);
    }
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
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center group"
        onClick={toggleSidebar}
      >
        <TbMinusVertical className="text-2xl" />
        {isSidebarVisible ? (
          <IoArrowBackOutline className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        ) : (
          <IoArrowForwardOutline className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
        {messages.map((m, i) => (
          <div key={i}>
            <ChatMessage role={m.role} content={m.content as string} />
          </div>
        ))}
      </div>

      <form className="mb-8 w-full" action={handleSubmit}>
        <div className="flex items-center justify-between rounded border border-slate-300 p-2 shadow-xl">
          <input
            className="flex-1 bg-transparent p-2 text-slate-900 placeholder:text-gray-500 focus:outline-none"
            value={input}
            placeholder="LawLine AI 봇에게 법률에 대해 물어보세요."
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="ml-4 p-2">
            <FaPaperPlane className="text-slate-300" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
