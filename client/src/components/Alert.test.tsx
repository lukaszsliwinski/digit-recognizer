// Alert component unit test

import '@testing-library/jest-dom';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import Alert from './Alert';

jest.useFakeTimers();

describe('Alert component', () => {
  it('renders the alert text applies correct background class based on type', () => {
    const { rerender } = render(<Alert type="warning" text="Warning alert" />);
    expect(screen.getByText('Warning alert')).toHaveClass('bg-amber-500');

    rerender(<Alert type="error" text="Error alert" />);
    expect(screen.getByText('Error alert')).toHaveClass('bg-red-500');
  });

  it('auto-hides the alert after 3 seconds', () => {
    render(<Alert type="warning" text="Warning alert" />);
    const alertDiv = screen.getByText('Warning alert');

    expect(alertDiv).toHaveClass('opacity-100');
    act(() => jest.advanceTimersByTime(3000));
    expect(alertDiv).toHaveClass('opacity-0');
  });
});
