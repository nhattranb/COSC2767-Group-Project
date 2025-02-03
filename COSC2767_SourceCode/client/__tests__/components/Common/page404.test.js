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
import { describe, expect, it } from '@jest/globals';
import Page404 from '../../../app/components/Common/Page404';

describe('Page404 component', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Page404 />);
        expect(getByText('The page you are looking for was not found.')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Page404 />);
        expect(asFragment()).toMatchSnapshot();
    });
});
