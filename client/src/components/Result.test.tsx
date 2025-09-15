// Result component unit test

import '@testing-library/jest-dom';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import Result from './Result';

jest.useFakeTimers();

describe('Result component', () => {
  it('renders result, labels, and animates percentage', () => {
    render(<Result result="7" confidence="75" />);

    // check result text
    expect(screen.getByText('7')).toBeInTheDocument();

    // check static labels
    expect(screen.getByText('CONFIDENCE')).toBeInTheDocument();
    expect(screen.getByText('RECOGNIZED')).toBeInTheDocument();

    // check percentage after animation
    act(() => jest.runAllTimers());
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
