'use client';

import { cn } from '@/utils/style';
import { useState } from 'react';
import ChatRoom from './ChatRoom';
import ChatSideBar from './ChatSideBar';

interface ChatContainerProps {}

const ChatContainer: React.FC<ChatContainerProps> = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  return (
    <div className={cn('absolute top-0 left-0', 'h-screen w-full', 'flex')}>
      <ChatSideBar isSidebarVisible={isSidebarVisible} />
      <div
        className={cn(
          'flex-1',
          'bg-[#e3f2e6]',
          'transition-all duration-300 ease-in-out',
          isSidebarVisible ? 'ml-64' : 'ml-0'
        )}
      >
        <ChatRoom
          roomId={roomId}
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
      </div>
    </div>
  );
};
export default ChatContainer;
