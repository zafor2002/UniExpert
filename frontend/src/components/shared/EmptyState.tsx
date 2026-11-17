import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`card p-10 md:p-14 text-center bg-white border border-[#E2E8F0] rounded-3xl shadow-sm flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] flex items-center justify-center text-[#8AB4F8]">
        <Icon size={26} strokeWidth={1.75} />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-base font-bold text-[#1E293B]">
          {title}
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>

      {action && (
        <div className="pt-2">
          <button
            onClick={action.onClick}
            className="btn-primary text-xs px-5 py-2.5 font-semibold"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

