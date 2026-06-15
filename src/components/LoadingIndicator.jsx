import React from 'react';
import { LOCALIZATION } from '../utils/localization';

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-10 h-10 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" />
      <p className="text-sm text-gray-500">{LOCALIZATION.misc.loading}</p>
    </div>
  );
}
