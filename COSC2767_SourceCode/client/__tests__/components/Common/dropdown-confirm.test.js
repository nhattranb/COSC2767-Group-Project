import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DropdownConfirm from '../../../app/components/Common/DropdownConfirm';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import {describe, expect, it, jest} from "@jest/globals";
import '@testing-library/jest-dom';

jest.mock('reactstrap', () => ({
    UncontrolledButtonDropdown: ({ children }) => <div>{children}</div>,
    DropdownToggle: ({ children, ...props }) => <button {...props}>{children}</button>,
    DropdownMenu: ({ children }) => <div>{children}</div>,
}));

describe('DropdownConfirm component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(<DropdownConfirm />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with custom className', () => {
        const { asFragment } = render(<DropdownConfirm className="custom-class" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with label', () => {
        const { asFragment } = render(<DropdownConfirm label="Test Label" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with children', () => {
        const { asFragment } = render(
            <DropdownConfirm>
                <p>Additional content</p>
            </DropdownConfirm>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
