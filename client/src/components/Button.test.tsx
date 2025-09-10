// Button component unit test

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { IButton } from '../types';

describe('Button component', () => {
  it('renders the button with correct text', () => {
    const props: IButton = {
      type: 'button',
      text: 'Test button',
      click: undefined,
      disabled: undefined,
    };

    render(<Button {...props} />);
    const button = screen.getByText('Test button');
    expect(button).toBeInTheDocument();
  });

  it('calls click handler when clicked', () => {
    const handleClick: IButton['click'] = jest.fn();
    const props: IButton = {
      type: 'button',
      text: 'Test button',
      click: handleClick,
      disabled: false,
    };

    render(<Button {...props} />);
    const button = screen.getByText('Test button');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const props: IButton = {
      type: 'button',
      text: 'Test button',
      click: undefined,
      disabled: true,
    };

    render(<Button {...props} />);
    const button = screen.getByText('Test button');
    expect(button).toBeDisabled();
  });

  it('is enabled when the disabled prop is false or undefined', () => {
    const props: IButton = {
      type: 'button',
      text: 'Test button',
      click: undefined,
      disabled: false,
    };

    render(<Button {...props} />);
    const button = screen.getByText('Test button');
    expect(button).toBeEnabled();
  });
});
