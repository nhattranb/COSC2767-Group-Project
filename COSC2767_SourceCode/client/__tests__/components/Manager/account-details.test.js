/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 21 Dec 2024
 *   Last modified: 21 Dec 2024
 */

import React from 'react';
import { render } from '@testing-library/react';
import AccountDetails from "../../../app/components/Manager/AccountDetails";
import {expect, jest, test} from "@jest/globals";

test('AccountDetails component snapshot', () => {
    const user = {
        provider: 'Email',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890'
    };

    const accountChange = jest.fn();
    const updateProfile = jest.fn();

    const { asFragment } = render(
        <AccountDetails user={user} accountChange={accountChange} updateProfile={updateProfile} />
    );

    expect(asFragment()).toMatchSnapshot();
});
