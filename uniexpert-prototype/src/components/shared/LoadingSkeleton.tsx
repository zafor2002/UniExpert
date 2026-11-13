import React from 'react';
import { clsx } from 'clsx';

type SkeletonVariant = 'card' | 'list' | 'table';

interface LoadingSkeletonProps {
  variant: SkeletonVariant;
  className?: string;
}

const listWidths = ['w-full', 'w-4/5', 'w-3/5', 'w-5/6', 'w-2/3'];

const CardSkeleton: React.FC = () => (
  <div className="card p-6 bg-white border border-[#E2E8F0] rounded-3xl animate-pulse space-y-4">
    <div className="skeleton h-[160px] w-full rounded-2xl bg-[#F4F8FF]" />
    <div className="skeleton h-4 w-3/4 rounded-lg bg-[#E2E8F0]" />
    <div className="skeleton h-3 w-1/2 rounded-lg bg-[#E2E8F0]" />
    <div className="flex gap-2 pt-2">
      <div className="skeleton h-6 w-16 rounded-full bg-[#EAF2FF]" />
      <div className="skeleton h-6 w-20 rounded-full bg-[#EAF2FF]" />
    </div>
  </div>
);

const ListSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {listWidths.map((w, i) => (
      <div key={i} className="flex items-center gap-3 p-4 bg-white border border-[#E2E8F0] rounded-2xl">
        <div className="skeleton h-10 w-10 rounded-2xl bg-[#EAF2FF] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className={clsx('skeleton h-4 rounded-lg bg-[#E2E8F0]', w)} />
          <div className="skeleton h-3 w-1/3 rounded-lg bg-[#F4F8FF]" />
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton: React.FC = () => (
  <div className="card overflow-hidden bg-white border border-[#E2E8F0] rounded-3xl animate-pulse">
    <div className="p-4 border-b border-[#E2E8F0] bg-[#F4F8FF]/80">
      <div className="skeleton h-5 w-48 rounded-lg bg-[#E2E8F0]" />
    </div>
    <table className="w-full">
      <thead>
        <tr className="border-b border-[#E2E8F0] bg-[#F4F8FF]/50">
          {[...Array(4)].map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <div className="skeleton h-4 w-20 rounded-md bg-[#E2E8F0]" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, row) => (
          <tr key={row} className="border-b border-[#E2E8F0]/60 last:border-0">
            {[...Array(4)].map((_, col) => (
              <td key={col} className="px-4 py-3.5">
                <div className={clsx('skeleton h-4 rounded-md bg-[#F4F8FF]', col === 0 ? 'w-32' : col === 3 ? 'w-16' : 'w-24')} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant, className }) => {
  return (
    <div className={className}>
      {variant === 'card' && <CardSkeleton />}
      {variant === 'list' && <ListSkeleton />}
      {variant === 'table' && <TableSkeleton />}
    </div>
  );
};

export default LoadingSkeleton;
