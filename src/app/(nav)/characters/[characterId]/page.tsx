import CharacterContainer from '@/components/character/CharacterContainer';
import { authOptions } from '@/libs/next-auth';
import { getServerSession } from 'next-auth';

interface CharacterPageProps {
  params: {
    characterId: string;
  };
}

export default async function Page({ params }: CharacterPageProps) {
  const session = await getServerSession(authOptions);
  return (
    <CharacterContainer userId={session?.user.id} characterId={params.characterId} />
  );
}
