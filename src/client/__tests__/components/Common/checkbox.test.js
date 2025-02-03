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
import { render, fireEvent } from '@testing-library/react';
import Checkbox from '../../../app/components/Common/Checkbox';
import {describe, expect, it} from "@jest/globals";

describe('Checkbox component', () => {
    it('renders correctly with default props', () => {
        const { asFragment } = render(<Checkbox id="test-checkbox" name="test" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with custom className', () => {
        const { asFragment } = render(<Checkbox id="test-checkbox" name="test" className="custom-class" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly with label', () => {
        const { asFragment } = render(<Checkbox id="test-checkbox" name="test" label="Test Label" />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly when checked', () => {
        const { asFragment } = render(<Checkbox id="test-checkbox" name="test" checked />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly when disabled', () => {
        const { asFragment } = render(<Checkbox id="test-checkbox" name="test" disabled />);
        expect(asFragment()).toMatchSnapshot();
    });
});
