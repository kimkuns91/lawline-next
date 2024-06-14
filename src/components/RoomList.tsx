import { useEffect, useState } from 'react';

import { cn } from '@/utils/style';
import { AIChatRoom } from '@prisma/client';
import axios from 'axios';
import Spinner from './Spinner';

interface RoomListProps {
  session: any;
  status: any;
}
const RoomList: React.FC<RoomListProps> = ({ session, status }) => {
  const [roomList, setRoomList] = useState<AIChatRoom[] | null>(null);

  useEffect(() => {
    (async () => {
      if (session?.user.id) {
        try {
          const result = await axios.get(`/api/chat/${session?.user.id}`);
          setRoomList(result.data.rooms);
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        }
      }
    })();
  }, [session]);

  if (status === 'loading') {
    return <Spinner />;
  }
  if (status === 'unauthenticated') {
    return;
  }
  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-2')}>
      <ul>
        {roomList &&
          roomList.map((room, i) => (
            <li
              key={i}
              className={cn(
                'my-2 p-2 cursor-pointer transition-colors duration-200 rounded'
                // roomId === room.roomId
                //   ? 'bg-blue-500 text-white'
                //   : 'hover:bg-gray-200'
              )}
              onClick={() => {
                // setRoomId(room.id);
              }}
            >
              {room.title}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RoomList;
