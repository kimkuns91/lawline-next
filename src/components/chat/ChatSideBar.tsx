import { MdChevronRight, MdHome } from 'react-icons/md';

import { cn } from '@/utils/style';
import Image from 'next/image';
import Link from 'next/link';
import { RiRobot2Line } from 'react-icons/ri';
import { RoomState } from './ChatContainer';

interface ChatSideBarProps {
  isSidebarVisible: boolean;
  rooms: RoomState[] | null;
  roomId: string | null;
  setRoomId: (value: string) => void;
}

const ChatSideBar: React.FC<ChatSideBarProps> = ({
  isSidebarVisible,
  rooms,
  roomId,
  setRoomId,
}) => {
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
      <div className={cn('px-2 py-6', 'border-b border-slate-300')}>
        <Image
          className="pl-4 mb-6"
          src="/images/Logo.png"
          alt="LawLine Logo"
          width={160}
          height={0}
        />
        <div
          className={cn(
            'flex items-center justify-between',
            'rounded',
            'py-2 pl-4 pr-6',
            'hover:bg-gray-200',
            'cursor-pointer'
          )}
        >
          <Link href={'/ai'} className={cn('flex items-center')}>
            <MdHome className={cn('mr-4 text-lg')} />
            <p className="text-base font-semibold">채팅 홈</p>
          </Link>
          <MdChevronRight />
        </div>
        <div
          className={cn(
            'flex items-center justify-between',
            'rounded',
            'py-2 pl-4 pr-6',
            'hover:bg-gray-200',
            'cursor-pointer'
          )}
        >
          <Link href={'/characters'} className={cn('flex items-center')}>
            <RiRobot2Line className={cn('mr-4 text-lg')} />
            <p className="text-base font-semibold">AI 캐릭터 홈</p>
          </Link>
          <MdChevronRight />
        </div>
      </div>
      <div className="p-4 px-6">
        <p>대화 내역</p>
      </div>
      {/* 대화 내역 목록 예시 */}
      <div className={cn('flex-1 overflow-y-auto px-6 py-2')}>
        <ul>
          {rooms &&
            rooms.map((room, i) => (
              <li
                key={i}
                className={cn(
                  'my-2 p-2 cursor-pointer transition-colors duration-200 rounded',
                  roomId === room.roomId
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                )}
                onClick={() => {
                  setRoomId(room.roomId);
                }}
              >
                {room.title}
              </li>
            ))}
        </ul>
      </div>
      <div className={cn('flex w-full px-6 py-8')}>
        <Link
          className={cn(
            'w-full flex justify-center items-center rounded bg-[#40ab55] text-white py-2',
            'hover:opacity-70'
          )}
          href="/login"
        >
          로그인
        </Link>
      </div>
    </div>
  );
};
export default ChatSideBar;
