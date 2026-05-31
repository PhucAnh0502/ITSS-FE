import React from 'react';
import { LOCALIZATION } from '../utils/localization';

const statusConfig = {
  available: { label: LOCALIZATION.status.available, className: 'status-badge--available' },
  busy: { label: LOCALIZATION.status.busy, className: 'status-badge--busy' },
  closed: { label: LOCALIZATION.status.closed, className: 'status-badge--closed' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.closed;

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
