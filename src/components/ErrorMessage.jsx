import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-center gap-2 p-4 m-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
      <span className="text-xl shrink-0" aria-hidden="true">⚠️</span>
      <p className="text-sm text-red-800 leading-snug">{message}</p>
    </div>
  );
}
