import React from 'react';

interface PageHeaderProps {
  badgeText?: string;
  badgeSubtext?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badgeText,
  badgeSubtext,
  title,
  description,
  icon,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`card p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${className}`}
    >
      <div className="space-y-1.5 max-w-2xl">
        {(badgeText || badgeSubtext) && (
          <div className="flex items-center gap-2 mb-1">
            {badgeText && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E3A8A] border border-[#B0CFFB]">
                {badgeText}
              </span>
            )}
            {badgeSubtext && (
              <span className="text-xs text-[#94A3B8]">· {badgeSubtext}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] border border-[#8AB4F8]/40 flex items-center justify-center text-[#2563EB] shrink-0">
              {icon}
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-[#1E293B] tracking-tight">
            {title}
          </h1>
        </div>

        {description && (
          <p className="text-xs text-[#64748B] leading-relaxed pt-0.5">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

