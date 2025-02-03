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
import {describe, expect, it, jest} from "@jest/globals";
import Pagination from '../../../app/components/Common/Pagination';

describe('Pagination component', () => {
    const mockOnPagination = jest.fn();

    it('renders correctly with default props', () => {
        const { container } = render(
            <Pagination totalPages={5} onPagination={mockOnPagination} />
        );
        const paginationBox = container.querySelector('.pagination-box');
        expect(paginationBox).toBeInTheDocument();
        const pageItems = container.querySelectorAll('.page-item');
        expect(pageItems.length).toBeGreaterThan(0);
    });


    it('matches snapshot', () => {
        const { asFragment } = render(
            <Pagination totalPages={5} onPagination={mockOnPagination} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
