import React from 'react';
import { LOCALIZATION } from '../utils/localization';

export default function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <div className="loading-indicator__spinner" aria-hidden="true" />
      <p className="loading-indicator__text">{LOCALIZATION.misc.loading}</p>
    </div>
  );
}
