import React from 'react';
import { render } from '@testing-library/react';
import ComingSoon from '../../../app/components/Common/ComingSoon';

describe('ComingSoon component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(<ComingSoon />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with children', () => {
        const { asFragment } = render(
            <ComingSoon>
                <p>Additional content</p>
            </ComingSoon>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
