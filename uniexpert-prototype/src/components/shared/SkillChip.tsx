import React from 'react';
import { X } from 'lucide-react';

type ChipVariant = 'matched' | 'missing' | 'tentative' | 'neutral';

interface SkillChipProps {
  skill: string;
  variant: ChipVariant;
  onRemove?: () => void;
}

const variantClass: Record<ChipVariant, string> = {
  matched: 'skill-chip-matched',
  missing: 'skill-chip-missing',
  tentative: 'skill-chip-tentative',
  neutral: 'skill-chip-neutral',
};

const SkillChip: React.FC<SkillChipProps> = ({ skill, variant, onRemove }) => {
  return (
    <span className={variantClass[variant]}>
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity focus-visible:outline-none"
          aria-label={`Remove ${skill}`}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
};

export default SkillChip;
