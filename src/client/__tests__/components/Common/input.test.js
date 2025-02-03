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
import Input from '../../../app/components/Common/Input';
import LoadingIndicator from "../../../app/components/Common/LoadingIndicator";

describe('Input component', () => {
    const mockOnInputChange = jest.fn();

    it('renders textarea correctly', () => {
        const { getByPlaceholderText } = render(
            <Input
                type="textarea"
                value=""
                placeholder="Enter text"
                onInputChange={mockOnInputChange}
            />
        );
        const textarea = getByPlaceholderText('Enter text');
        expect(textarea).toBeInTheDocument();
        fireEvent.change(textarea, { target: { value: 'test' } });
        expect(mockOnInputChange).toHaveBeenCalledWith("", 'test');
    });

    it('renders number input correctly', () => {
        const { getByPlaceholderText } = render(
            <Input
                type="number"
                value=""
                placeholder="Enter number"
                onInputChange={mockOnInputChange}
            />
        );
        const numberInput = getByPlaceholderText('Enter number');
        expect(numberInput).toBeInTheDocument();
        fireEvent.change(numberInput, { target: { value: '123' } });
        expect(mockOnInputChange).toHaveBeenCalledWith("", '123');
    });

    it('renders stars input correctly', () => {
        const { container } = render(
            <Input
                type="stars"
                value={3}
                onInputChange={mockOnInputChange}
            />
        );
        const starsInput = container.querySelector('.fa-star');
        expect(starsInput).toBeInTheDocument();
        fireEvent.click(starsInput);
        expect(mockOnInputChange).toHaveBeenCalled();
    });

    it('renders text input correctly', () => {
        const { getByPlaceholderText } = render(
            <Input
                type="text"
                value=""
                placeholder="Enter text"
                onInputChange={mockOnInputChange}
            />
        );
        const textInput = getByPlaceholderText('Enter text');
        expect(textInput).toBeInTheDocument();
        fireEvent.change(textInput, { target: { value: 'test' } });
        expect(mockOnInputChange).toHaveBeenCalledWith("", 'test');
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<LoadingIndicator />);
        expect(asFragment()).toMatchSnapshot();
    });
});
