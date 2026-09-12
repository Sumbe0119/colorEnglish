// frontend/src/components/rule/structure-chips.tsx
'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import type { StructurePart } from '@/lib/grammar/types';
import { PART_CHIP_CLASS } from '@/components/rule/colored-sentence';

/** Дүрмийн томьёог өнгөт чип болгон харуулна: [Subject] + [am/is/are] + [complement]. */
export function StructureChips({
  parts,
  separator = '+',
  className,
}: {
  parts: StructurePart[];
  separator?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {parts.map((part, i) => (
        <Fragment key={`${part.text}-${i}`}>
          {i > 0 && <span className="text-sm text-mist-500">{separator}</span>}
          <span
            className={cn(
              'rounded-lg border px-2.5 py-1 font-display text-sm leading-5',
              PART_CHIP_CLASS[part.part],
            )}
          >
            {part.text}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
