// Draw component integration test

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertProvider } from '../context/AlertContext';
import Draw from './Draw';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

describe('Draw component tests', () => {
  it('renders main elements and buttons', () => {
    const { container } = render(
      <AlertProvider>
        <Draw />
      </AlertProvider>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    const recognizeBtn = screen.getByText('RECOGNIZE');
    const clearBtn = screen.getByText('CLEAR');

    expect(recognizeBtn).toBeDisabled();
    expect(clearBtn).toBeEnabled();
  });

  it('enables RECOGNIZE after drawing', async () => {
    const { container } = render(
      <AlertProvider>
        <Draw />
      </AlertProvider>
    );

    const canvas = container.querySelector('canvas')!;
    const recognizeBtn = screen.getByText('RECOGNIZE') as HTMLButtonElement;

    // Start drawing
    fireEvent.mouseDown(canvas, { nativeEvent: { offsetX: 10, offsetY: 10 } });
    expect(recognizeBtn.disabled).toBe(false);
  });
});
