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
import {describe, expect, it} from "@jest/globals";
import LoadingIndicator from '../../../app/components/Common/LoadingIndicator';

describe('LoadingIndicator component', () => {
    it('renders correctly with default props', () => {
        const { container } = render(<LoadingIndicator />);
        const spinnerContainer = container.querySelector('.spinner-container');
        const spinner = container.querySelector('.spinner');
        expect(spinnerContainer).toBeInTheDocument();
        expect(spinnerContainer).toHaveClass('position-fixed overlay');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('position-fixed overlay');
    });

    it('renders correctly with inline prop', () => {
        const { container } = render(<LoadingIndicator inline />);
        const spinnerContainer = container.querySelector('.spinner-container');
        const spinner = container.querySelector('.spinner');
        expect(spinnerContainer).toBeInTheDocument();
        expect(spinnerContainer).toHaveClass('position-relative');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('position-relative');
    });

    it('renders correctly with backdrop prop', () => {
        const { container } = render(<LoadingIndicator backdrop />);
        const spinnerContainer = container.querySelector('.spinner-container');
        expect(spinnerContainer).toBeInTheDocument();
        expect(spinnerContainer).toHaveClass('backdrop');
    });

    it('renders correctly with both inline and backdrop props', () => {
        const { container } = render(<LoadingIndicator inline backdrop />);
        const spinnerContainer = container.querySelector('.spinner-container');
        const spinner = container.querySelector('.spinner');
        expect(spinnerContainer).toBeInTheDocument();
        expect(spinnerContainer).toHaveClass('position-relative backdrop');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('position-relative');
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<LoadingIndicator />);
        expect(asFragment()).toMatchSnapshot();
    });
});
