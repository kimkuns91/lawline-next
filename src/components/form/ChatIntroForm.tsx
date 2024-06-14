'use client';

import { ChangeEvent, useState } from 'react';

import { cn } from '@/utils/style';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatIntroFormProps {
  userId?: string;
}

const ChatIntroForm: React.FC<ChatIntroFormProps> = ({ userId }) => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scroll height
    setInput(textarea.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    const result = await axios.post('/api/room', { input, userId });
    const newRoomId = result.data.id;
    router.push(`/c/${newRoomId}`);
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
      <div className="flex flex-1 items-center justify-center flex-col gap-6 overflow-y-auto px-4 py-6">
        <h2 className="font-bold text-3xl mb-8">
          로라인 봇에게 법률 상담을 해보세요.
        </h2>
        <form className="mb-8 w-full" onSubmit={() => {}}>
          <div className="flex items-center justify-between rounded-3xl border border-slate-300 px-6 py-2 shadow-xl">
            <textarea
              className="flex-1 bg-transparent p-2 text-slate-900 placeholder:text-gray-500 focus:outline-none resize-none overflow-hidden"
              style={{ maxHeight: 'calc(1.5em * 8)', lineHeight: '1.5em' }}
              value={input}
              placeholder="LawLine AI 봇에게 법률에 대해 물어보세요."
              onChange={(e) => handleInputChange(e)}
            />
            <button
              type="submit"
              className={cn(
                'ml-4 p-2',
                isSending ? 'opacity-50 cursor-not-allowed' : 'text-slate-700'
              )}
              disabled={isSending || !input.trim()} // 메시지 전송 중이거나 입력 값이 없으면 비활성화
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChatIntroForm;
