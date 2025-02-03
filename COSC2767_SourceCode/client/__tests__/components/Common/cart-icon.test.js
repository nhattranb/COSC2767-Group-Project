import React from 'react';
import { render } from '@testing-library/react';
import CartIcon from '../../../app/components/Common/CartIcon';

jest.mock('../../../app/components/Common/Icon', () => ({
    BagIcon: () => <span>BagIcon</span>,
}));

describe('CartIcon component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(<CartIcon cartItems={[]} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with items in the cart', () => {
        const { asFragment } = render(<CartIcon cartItems={[1, 2, 3]} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with more than 99 items in the cart', () => {
        const { asFragment } = render(<CartIcon cartItems={Array(100).fill(0)} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with custom className', () => {
        const { asFragment } = render(<CartIcon className="custom-class" cartItems={[]} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('calls onClick when button is clicked', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<CartIcon onClick={handleClick} cartItems={[]} />);
        getByRole('button').click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
