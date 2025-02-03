/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 25 Dec 2024
 *   Last modified: 25 Dec 2024
 */

import thunk from 'redux-thunk';
import { success } from 'react-notification-system-redux';
import {beforeEach, describe, expect, it} from "@jest/globals";
import {
    ACCOUNT_CHANGE,
    CLEAR_ACCOUNT,
    FETCH_PROFILE,
    SET_PROFILE_LOADING
} from "../../app/containers/Account/constants";
import {
    accountChange,
    clearAccount,
    fetchProfile,
    setProfileLoading,
    updateProfile
} from "../../app/containers/Account/actions";
import {API_URL} from "../../app/constants";
import axios from "axios";
import configureStore from "redux-mock-store";
const AxiosMockAdapter = require("axios-mock-adapter");

const axiosMock = new AxiosMockAdapter(axios);

const middlewares = [thunk];

const mockStore = configureStore([thunk]);
const store = mockStore({
    resetFormData: {
        password: '',
        confirmPassword: ''
    },
    formErrors: {
        password: '',
        confirmPassword: ''
    },
    isToken: true,
    account: {
        name: 'John Doe',
        email: 'doe@gmail.com'
    }
});

describe('Account Actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('should create an action to change account fields', () => {
        const name = 'email';
        const value = 'new@example.com';
        const expectedAction = {
            type: ACCOUNT_CHANGE,
            payload: { [name]: value }
        };

        expect(accountChange(name, value)).toEqual(expectedAction);
    });

    it('should create an action to clear account', () => {
        const expectedAction = { type: CLEAR_ACCOUNT };

        expect(clearAccount()).toEqual(expectedAction);
    });

    it('should create an action to set profile loading', () => {
        const value = true;
        const expectedAction = {
            type: SET_PROFILE_LOADING,
            payload: value
        };

        expect(setProfileLoading(value)).toEqual(expectedAction);
    });

    it('should fetch the user profile successfully', async () => {
        const mockUser = { name: 'John Doe', email: 'john@example.com' };
        axiosMock.onGet(`${API_URL}/user/me`).reply(200, { user: mockUser });

        const expectedActions = [
            { type: SET_PROFILE_LOADING, payload: true },
            { type: FETCH_PROFILE, payload: mockUser },
            { type: SET_PROFILE_LOADING, payload: false }
        ];

        await store.dispatch(fetchProfile());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should handle fetch profile error', async () => {
        axiosMock.onGet(`${API_URL}/user/me`).reply(500);

        const expectedActions = [
            { type: SET_PROFILE_LOADING, payload: true },
            { type: SET_PROFILE_LOADING, payload: false }
        ];

        await store.dispatch(fetchProfile());

        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions).toEqual(expectedActions);
    });

    it('should update the user profile successfully', async () => {
        const mockUser = { name: 'John Doe', email: 'updated@example.com' };
        const mockMessage = 'Profile updated successfully';

        axiosMock.onPut(`${API_URL}/user`).reply(200, {
            user: mockUser,
            message: mockMessage
        });


        const expectedActions = [
            { type: FETCH_PROFILE, payload: mockUser },
            success({
                title: mockMessage,
                position: 'tr',
                autoDismiss: 1
            })
        ];

        await store.dispatch(updateProfile());

        const actions = store.getActions();
        expect(actions.payload).toEqual(expectedActions.payload);
    });

    it('should handle update profile error', async () => {
        axiosMock.onPut(`${API_URL}/user`).reply(500);

        await store.dispatch(updateProfile());

        const actions = store.getActions();
        expect(actions).toHaveLength(0); // No state updates occur on error
    });
});
