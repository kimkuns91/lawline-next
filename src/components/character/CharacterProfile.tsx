import { AIModel } from '@prisma/client';
import Image from 'next/image';

interface CharacterProfileProps {
  character: AIModel;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ character }) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center border-b bordor-slate-200 pb-8">
      <Image
        className="rounded-full"
        src={character.profileImg}
        alt="character"
        width={120}
        height={120}
      />
      <h1 className="font-bold text-xl">{character.name}</h1>
      <p className="font-semibold text-sm">{character.description}</p>
    </div>
  );
};

export default CharacterProfile;
