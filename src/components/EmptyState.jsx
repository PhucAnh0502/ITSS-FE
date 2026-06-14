import React from 'react';

export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
      <span className="text-4xl" aria-hidden="true">📭</span>
      <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed">{message}</p>
    </div>
  );
}
