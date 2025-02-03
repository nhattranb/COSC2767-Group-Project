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
import {fireEvent, render} from '@testing-library/react';
import Switch from '../../../app/components/Common/Switch';

test('renders Switch correctly', () => {
    const { asFragment } = render(
        <Switch
            checked={true}
            className="custom-class"
            id="switch1"
            label="Toggle Switch"
            tooltip={true}
            tooltipContent="This is a tooltip"
            toggleCheckboxChange={jest.fn()}
        />
    );
    expect(asFragment()).toMatchSnapshot();
});

test('toggles checkbox state correctly', () => {
    const toggleCheckboxChange = jest.fn();
    const { getByLabelText } = render(
        <Switch
            checked={false}
            id="switch1"
            label="Toggle Switch"
            toggleCheckboxChange={toggleCheckboxChange}
        />
    );

    const checkbox = getByLabelText('Toggle Switch');
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(toggleCheckboxChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
    expect(toggleCheckboxChange).toHaveBeenCalledWith(false);
});
