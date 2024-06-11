import { cn } from '@/utils/style';
import { AIModel } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface ChatacterModelProps {
  aiModel: AIModel;
}

const ChatacterModel: React.FC<ChatacterModelProps> = ({ aiModel }) => {
  return (
    <Link
      href={'/characters/' + aiModel.id}
      className={cn('flex gap-4 border-b border-slate-600 py-6')}
    >
      <Image
        className="rounded-md"
        src={aiModel.profileImg}
        alt={aiModel.name}
        width={110}
        height={110}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold">{aiModel.name}</h3>
        <p className="text-sm">{aiModel.description}</p>
      </div>
    </Link>
  );
};
export default ChatacterModel;
