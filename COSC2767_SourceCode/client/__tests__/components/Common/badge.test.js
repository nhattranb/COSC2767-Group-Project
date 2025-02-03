/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 17 Dec 2024
 *   Last modified: 17 Dec 2024
 */

import React from 'react';
import { render } from '@testing-library/react';
import Badge from "../../../app/components/Common/Badge";

describe('Badge component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(<Badge>Default Badge</Badge>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with primary variant', () => {
        const { asFragment } = render(<Badge variant="primary">Primary Badge</Badge>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with danger variant', () => {
        const { asFragment } = render(<Badge variant="danger">Danger Badge</Badge>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with custom className', () => {
        const { asFragment } = render(<Badge className="custom-class">Custom Class Badge</Badge>);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with borderless and round props', () => {
        const { asFragment } = render(<Badge borderless round={10}>Borderless Round Badge</Badge>);
        expect(asFragment()).toMatchSnapshot();
    });
});
