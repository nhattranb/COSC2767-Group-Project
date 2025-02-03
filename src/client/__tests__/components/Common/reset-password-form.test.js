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
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ResetPasswordForm from '../../../app/components/Common/ResetPasswordForm';
import { expect, test } from '@jest/globals';


// Create a mock store with specified states
const mockStore = configureStore([]);
const store = mockStore({
    resetFormData: {
        password: '',
        confirmPassword: ''
    },
    formErrors: {
        password: '',
        confirmPassword: ''
    },
    isToken: true
});

test('ResetPasswordForm component matches snapshot', () => {
    const { asFragment } = render(
        <Provider store={store}>
            <ResetPasswordForm
                resetFormData={store.getState().resetFormData}
                formErrors={store.getState().formErrors}
                isToken={store.getState().isToken}
                resetPasswordChange={jest.fn()}
                resetPassword={jest.fn()}
            />
        </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
});
