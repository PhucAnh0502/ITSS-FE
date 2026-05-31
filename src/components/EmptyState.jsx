import React from 'react';

export default function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">📭</span>
      <p className="empty-state__text">{message}</p>
    </div>
  );
}
