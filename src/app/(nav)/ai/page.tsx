import ChatContainer from '@/components/chat/ChatContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LawLine - AI Chat',
  description: 'LawLine AI와 대화해보세요.',
  icons: {
    icon: 'images/Favicon192.png',
  },
};

export default async function Page() {
  return <ChatContainer />;
}