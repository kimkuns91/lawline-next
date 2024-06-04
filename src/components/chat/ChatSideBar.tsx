import { MdChevronRight, MdHome } from 'react-icons/md';

import { cn } from '@/utils/style';
import Image from 'next/image';
import { RiRobot2Line } from "react-icons/ri";

interface ChatSideBarProps {
  isSidebarVisible: boolean;
}

const ChatSideBar: React.FC<ChatSideBarProps> = ({ isSidebarVisible }) => {
  return (
    <div
      className={cn(
        'fixed left-0 top-0',
        'h-full',
        'transition-transform duration-300 ease-in-out',
        'bg-white text-black',
        isSidebarVisible ? 'translate-x-0' : '-translate-x-full',
        'flex flex-col'
      )}
      style={{ width: '260px' }}
    >
      <div className={cn('px-2 py-6', 'border-b border-black')}>
        <Image
          className="px-2 mb-3"
          src="/images/Logo.png"
          alt="LawLine Logo"
          width={160}
          height={0}
        />
        <div
          className={cn(
            'flex items-center justify-between',
            'rounded',
            'p-2',
            'hover:bg-gray-200',
            'cursor-pointer'
          )}
        >
          <div className={cn('flex items-center')}>
            <MdHome className={cn('mr-4 text-lg')} />
            <p className="text-base">채팅 홈</p>
          </div>
          <MdChevronRight />
        </div>
        <div
          className={cn(
            'flex items-center justify-between',
            'rounded',
            'p-2',
            'hover:bg-gray-200',
            'cursor-pointer'
          )}
        >
          <div className={cn('flex items-center')}>
            <RiRobot2Line className={cn('mr-4 text-lg')} />
            <p className="text-base">AI 캐릭터 홈</p>
          </div>
          <MdChevronRight />
        </div>
      </div>
      <div className='p-4'>
        <p>대화 내역</p>
      </div>
        {/* 대화 내역 목록 예시 */}
      <div className={cn('flex-1 overflow-y-auto px-4 py-2')}>
        <ul>
          {Array.from({ length: 50 }, (_, i) => (
            <li key={i} className="my-2">
              대화 내역 {i + 1}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn('px-4 py-4')}>
        <button
          className={cn('w-full rounded bg-[#40ab55] text-white py-2', 'hover:opacity-70')}
        >
          로그인
        </button>
      </div>
    </div>
  );
};
export default ChatSideBar;
