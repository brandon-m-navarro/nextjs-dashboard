import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="min-h-5 max-h-7 min-w-5 rotate-[15deg]" />
      <p className="text-xl whitespace-nowrap ml-1">Brandon Inc.</p>
    </div>
  );
}
