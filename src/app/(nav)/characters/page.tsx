import CharacterContainer from '@/components/character/CharacterContainer';
import { getAIModels } from '@/libs/ai/actions';
import { authOptions } from '@/libs/next-auth';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'LawLine - AI Chat',
  description: 'LawLine AI와 대화해보세요.',
  icons: {
    icon: 'images/Favicon192.png',
  },
};

export default async function Page() {
  const aiModels = await getAIModels();
  const session = await getServerSession(authOptions);
  return <CharacterContainer userId={session?.user.id} aiModels={aiModels} />;
}
