'use client';

import { useEffect, useState } from 'react';
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';

import { cn } from '@/utils/style';
import axios from 'axios';
import { TbMinusVertical } from 'react-icons/tb';
import ChatRoom from './ChatRoom';
import ChatSideBar from './ChatSideBar';

interface ChatContainerProps {
  userId?: string;
}
export interface RoomState {
  roomId: string;
  title: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ userId }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomState[] | null>(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const result = await axios.get(`/api/chat/${userId}`);
          setRooms(result.data.rooms);
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        }
      })();
    } else {
      const storedRooms = localStorage.getItem('rooms');
      if (storedRooms) {
        setRooms(JSON.parse(storedRooms));
      }
    }
  }, [userId, setRoomId]);

  return (
    <div className={cn('absolute top-0 left-0', 'h-screen w-full', 'flex')}>
      <ChatSideBar
        isSidebarVisible={isSidebarVisible}
        rooms={rooms}
        roomId={roomId}
        setRoomId={setRoomId}
      />
      <div
        className={cn(
          'flex-1 relative',
          'bg-[#f7fcf8]',
          'transition-all duration-300 ease-in-out',
          isSidebarVisible ? 'ml-64' : 'ml-0',
          'border-l border-slate-300'
        )}
      >
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center group text-slate-400"
          onClick={toggleSidebar}
        >
          <TbMinusVertical className="text-2xl" />
          {isSidebarVisible ? (
            <IoArrowBackOutline className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          ) : (
            <IoArrowForwardOutline className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>

        <ChatRoom
          roomId={roomId}
          userId={userId}
          setRoomId={setRoomId}
        />
      </div>
    </div>
  );
};
export default ChatContainer;
