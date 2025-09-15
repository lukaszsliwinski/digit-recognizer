// ProgressCircle component unit test

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProgressCircle from './ProgressCircle';

describe('ProgressCircle component', () => {
  it('renders the percentage text and correct stroke color when percent is 50', () => {
    const { container } = render(<ProgressCircle percent={50} />);
    
    // check text
    expect(screen.getByText('50%')).toBeInTheDocument();

    // check stroke color
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle).toHaveAttribute('stroke', 'rgb(255, 143, 0)');
  });
});
