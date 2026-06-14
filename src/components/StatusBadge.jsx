import React from 'react';
import { LOCALIZATION } from '../utils/localization';

const statusConfig = {
  available: { label: LOCALIZATION.status.available, colorClass: 'bg-green-500' },
  busy: { label: LOCALIZATION.status.busy, colorClass: 'bg-orange-500' },
  closed: { label: LOCALIZATION.status.closed, colorClass: 'bg-gray-400' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.closed;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-bold text-white whitespace-nowrap tracking-wide ${config.colorClass}`}>
      {config.label}
    </span>
  );
}
