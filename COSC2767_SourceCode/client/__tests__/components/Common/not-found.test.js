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
import NotFound from '../../../app/components/Common/NotFound';

describe('NotFound component', () => {
    it('renders correctly with default props', () => {
        const { container } = render(<NotFound />);
        const notFoundDiv = container.querySelector('.not-found');
        expect(notFoundDiv).toBeInTheDocument();
        expect(notFoundDiv.className).toBe('not-found ');
    });

    it('renders correctly with message prop', () => {
        const { getByText } = render(<NotFound message="Page not found" />);
        expect(getByText('Page not found')).toBeInTheDocument();
    });

    it('renders correctly with children prop', () => {
        const { getByText } = render(<NotFound>Page not found</NotFound>);
        expect(getByText('Page not found')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const customClass = 'my-custom-error';
        render(<NotFound className={customClass} />);

        const notFoundElement = document.querySelector('.not-found');
        expect(notFoundElement).toBeInTheDocument();
        expect(notFoundElement).toHaveClass('not-found');
        expect(notFoundElement).toHaveClass(customClass);
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<NotFound />);
        expect(asFragment()).toMatchSnapshot();
    });
});
