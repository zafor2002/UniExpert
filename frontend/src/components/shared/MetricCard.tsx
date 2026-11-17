import React from 'react';

export type MetricVariant = 'default' | 'mint' | 'blue' | 'lavender' | 'amber' | 'rose';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  icon?: React.ReactNode;
  variant?: MetricVariant;
  className?: string;
}

const variantStyles: Record<MetricVariant, { card: string; label: string; value: string; badge: string }> = {
  default: {
    card: 'bg-white border-[#E2E8F0]',
    label: 'text-[#64748B]',
    value: 'text-[#1E293B]',
    badge: 'bg-[#F4F8FF] text-[#334155] border-[#E2E8F0]',
  },
  mint: {
    card: 'bg-white border-[#A7E8D0]/60',
    label: 'text-[#13533E]',
    value: 'text-[#0F766E]',
    badge: 'bg-[#DCFCEE] text-[#13533E] border-[#A7E8D0]',
  },
  blue: {
    card: 'bg-white border-[#8AB4F8]/50',
    label: 'text-[#1E3A8A]',
    value: 'text-[#2563EB]',
    badge: 'bg-[#EAF2FF] text-[#1E3A8A] border-[#B0CFFB]',
  },
  lavender: {
    card: 'bg-white border-[#C7D2FE]',
    label: 'text-[#3730A3]',
    value: 'text-[#4338CA]',
    badge: 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]',
  },
  amber: {
    card: 'bg-white border-[#FDE68A]',
    label: 'text-[#92400E]',
    value: 'text-[#B45309]',
    badge: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
  },
  rose: {
    card: 'bg-white border-[#FECACA]',
    label: 'text-[#991B1B]',
    value: 'text-[#DC2626]',
    badge: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  badge,
  icon,
  variant = 'default',
  className = '',
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`p-5 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between ${styles.card} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${styles.label}`}>
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-[#F4F8FF] border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight ${styles.value}`}>
            {value}
          </span>
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {badge}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed font-normal">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

