import { cn } from '@/utils/style';
import Link from 'next/link';
import { ReactNode } from 'react';
import { MdChevronRight } from 'react-icons/md';

interface CustomIconLinkProps {
  href: string;
  icon: ReactNode;
  text: string;
}

const CustomIconLink: React.FC<CustomIconLinkProps> = ({ href, icon, text }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'rounded',
        'py-2 px-4',
        'hover:bg-gray-200',
        'cursor-pointer'
      )}
    >
      <Link href={href} className={cn('flex items-center')}>
        {icon}
        <p className="text-base font-semibold ml-4">{text}</p>
      </Link>
      <MdChevronRight className="text-slate-500" />
    </div>
  );
};

export default CustomIconLink;
