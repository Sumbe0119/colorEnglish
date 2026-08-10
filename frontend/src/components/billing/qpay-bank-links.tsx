// frontend/src/components/billing/qpay-bank-links.tsx
'use client';

import { useState } from 'react';
import { QpayBankUrl } from '@/lib/billing-services';

export function QpayBankLinks({
  urls,
  className = '',
}: {
  urls: QpayBankUrl[];
  className?: string;
}) {
  const [brokenLogos, setBrokenLogos] = useState<Record<string, boolean>>({});

  if (urls.length === 0) return null;

  return (
    <div className={className}>
      <p className="mb-2 text-xs font-medium text-mist-400 md:hidden">
        Банкны апп сонгоод төлөх
      </p>
      <p className="mb-2 hidden text-xs font-medium text-mist-400 md:block">
        Банкны апп (утаснаас deeplink)
      </p>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {urls.map((u) => {
          const logoBroken = brokenLogos[u.link];
          return (
            <li key={`${u.name}-${u.link}`}>
              <a
                href={u.link}
                className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-ink-600 bg-ink-800/80 px-2 py-3 text-center transition-colors hover:border-brand/50 hover:bg-ink-800 active:scale-[0.98]"
                title={u.description || u.name}
              >
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
                  {u.logo && !logoBroken ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.logo}
                      alt={u.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenLogos((prev) => ({ ...prev, [u.link]: true }))
                      }
                    />
                  ) : (
                    <span className="text-[10px] font-bold uppercase leading-tight text-ink-700">
                      {u.name.slice(0, 3)}
                    </span>
                  )}
                </span>
                <span className="line-clamp-2 w-full text-[10px] font-medium leading-tight text-mist-200">
                  {u.name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
