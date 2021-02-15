import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { NumberAdjuster } from './NumberAdjuster';

describe('Number Adjuster', () => {
    const defaultProps = {
        name: "Group",
        amount: 1,
        increment: jest.fn(),
        decrement: jest.fn()
    };

    it('renders', () => {
        const { getByText } = render(<NumberAdjuster {...defaultProps} />);

        const element = getByText('Group');
        expect(element).toBeInTheDocument();
    });

    it('increment is called when clicked', () => {
        const { getByText } = render(<NumberAdjuster {...defaultProps} />);

        const element = getByText('+');
        fireEvent.click(element);

        expect(defaultProps.increment).toHaveBeenCalled();
    });

    it('decrement is called when clicked', () => {
        const { getByText } = render(<NumberAdjuster {...defaultProps} />);

        const element = getByText('-');
        fireEvent.click(element);

        expect(defaultProps.decrement).toHaveBeenCalled();
    });
})