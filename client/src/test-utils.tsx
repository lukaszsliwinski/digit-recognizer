// Helper for rendering components with AlertContext in tests

import React from 'react';
import { render } from '@testing-library/react';
import { AlertContext } from './context/AlertContext';

type RenderOptions = {
  alertValue?: any; // Optional custom context values for testing
};

// Custom render function to wrap UI with AlertContext
export function renderWithAlertContext(
  ui: React.ReactElement,
  { alertValue }: RenderOptions = {}
) {
  const defaultValue = {
    showAlert: () => {},
    ...alertValue,       // Override with test-specific context if provided
  };

  return render(
    <AlertContext.Provider value={defaultValue}>
      {ui}
    </AlertContext.Provider>
  );
}
