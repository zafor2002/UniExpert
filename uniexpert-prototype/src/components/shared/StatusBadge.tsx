import React from 'react';

type StatusType =
  | 'available'
  | 'nearing'
  | 'full'
  | 'blackout'
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'negotiation'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'pending'
  | 'active'
  | 'locked'
  | 'tier1'
  | 'tier2'
  | 'tier3';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

type BadgeConfig = {
  className: string;
  defaultLabel: string;
};

const statusConfig: Record<StatusType, BadgeConfig> = {
  available: { className: 'status-badge-available', defaultLabel: 'Available' },
  nearing: { className: 'status-badge-warning', defaultLabel: 'Nearing Full' },
  full: { className: 'status-badge-danger', defaultLabel: 'Full' },
  blackout: { className: 'status-badge-danger', defaultLabel: 'Blackout' },
  draft: { className: 'status-badge-neutral', defaultLabel: 'Draft' },
  submitted: { className: 'status-badge-primary', defaultLabel: 'Submitted' },
  under_review: { className: 'status-badge-warning', defaultLabel: 'Under Review' },
  negotiation: { className: 'status-badge-warning', defaultLabel: 'Negotiation' },
  accepted: { className: 'status-badge-available', defaultLabel: 'Accepted' },
  declined: { className: 'status-badge-danger', defaultLabel: 'Declined' },
  expired: { className: 'status-badge-neutral', defaultLabel: 'Expired' },
  pending: { className: 'status-badge-warning', defaultLabel: 'Pending' },
  active: { className: 'status-badge-available', defaultLabel: 'Active' },
  locked: { className: 'status-badge-danger', defaultLabel: 'Locked' },
  tier1: { className: 'status-badge-available', defaultLabel: 'Tier 1' },
  tier2: { className: 'status-badge-primary', defaultLabel: 'Tier 2' },
  tier3: { className: 'status-badge-warning', defaultLabel: 'Tier 3' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = statusConfig[status];
  return (
    <span className={config.className}>
      {label ?? config.defaultLabel}
    </span>
  );
};

export default StatusBadge;
