'use client';

import { useEffect, useState } from 'react';
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';

import { cn } from '@/utils/style';
import { AIModel } from '@prisma/client';
import axios from 'axios';
import { TbMinusVertical } from 'react-icons/tb';
import ChatSideBar from '../chat/ChatSideBar';
import CharacterChatRoom from './CharacterChatRoom';
import CharacterProfile from './CharacterProfile';
import ChatacterModel from './ChatacterModel';

interface CharacterContainerProps {
  aiModels?: AIModel[];
  userId?: string;
  characterId?: string;
}

interface RoomState {
  roomId: string;
  title: string;
}

const CharacterContainer: React.FC<CharacterContainerProps> = ({
  aiModels,
  userId,
  characterId,
}) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomState[] | null>(null);
  const [character, setCharacter] = useState<AIModel | null>(null);

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

  useEffect(() => {
    if (characterId) {
      (async () => {
        try {
          const characterResult = await axios.post('/api/character', {
            characterId,
          });
          setCharacter(characterResult.data);
        } catch (error) {
          console.error('Error fetching character:', error);
        }
      })();
    }
  }, [characterId]);

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
        <div className="size-full flex flex-col gap-4 items-center justify-center py-24">
          {character ? (
            <>
              <CharacterProfile character={character} />
              <CharacterChatRoom character={character} />
            </>
          ) : (
            <>
              <h2 className="text-center text-3xl font-bold">AI 캐릭터</h2>
              <p className="text-center text-base font-semibold">
                다양한 AI 캐릭터들에게 법률 상담을 받아보세요
              </p>
              <div className="flex flex-col gap-4">
                {aiModels &&
                  aiModels.map((aiModel, index) => (
                    <ChatacterModel key={index} aiModel={aiModel} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterContainer;
