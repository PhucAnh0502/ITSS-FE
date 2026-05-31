import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message__icon" aria-hidden="true">⚠️</span>
      <p className="error-message__text">{message}</p>
    </div>
  );
}
