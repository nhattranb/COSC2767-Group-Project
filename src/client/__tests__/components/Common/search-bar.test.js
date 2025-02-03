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
import {fireEvent, render, waitFor} from '@testing-library/react';
import SearchBar from "../../../app/components/Common/SearchBar";
import {expect, testm, jest, test} from "@jest/globals";

test('renders SearchBar correctly', () => {
    const { asFragment } = render(<SearchBar />);
    expect(asFragment()).toMatchSnapshot();
});

test('calls onBlur prop when input loses focus', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar onBlur={onBlur} />);
    const input = getByPlaceholderText('Search');

    fireEvent.blur(input, { target: { value: 'test' } });

    expect(onBlur).toHaveBeenCalledWith({ name: 'search', value: 'test' });
})

test('calls onSearch prop when typing', async () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar onSearch={onSearch} />);
    const input = getByPlaceholderText('Search');

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith({ name: 'search', value: 'test' });
    }, { timeout: 1500 });
});


test('calls onBlur prop when input loses focus', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar onBlur={onBlur} />);
    const input = getByPlaceholderText('Search');

    fireEvent.blur(input, { target: { value: 'test' } });

    expect(onBlur).toHaveBeenCalledWith({ name: 'search', value: 'test' });
})
