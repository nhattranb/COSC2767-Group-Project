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
import {render} from '@testing-library/react';
import Footer from "../../../app/components/Common/Footer";
import {beforeEach, describe, expect, test, jest} from "@jest/globals";
import {Router} from "react-router-dom";
import {createMemoryHistory} from "history";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";


export function createTestStore() {

    // mock reducers
    const userReducer = (state = {}, action) => {
        switch (action.type) {
            default:
                return state;
        }
    }

    const configReducer = (state = {}, action) => {
        switch (action.type) {
            default:
                return state;
        }
    }

    const newsletterReducer = (state = { email: 'test@example.com', formErrors: { email: 'Invalid email address' } }, action) => {
        switch (action.type) {
            default:
                return state;
        }
    }
    return createStore(
        combineReducers({
            user: userReducer,
            config: configReducer,
            newsletter: newsletterReducer
        })
    );
}
describe('Footer component', () => {

    let mockStore;
    beforeEach(() => {
        mockStore = createTestStore();
    });
    test('Footer component matches snapshot', () => {
        const history = createMemoryHistory();

        const { asFragment } = render(
            <Provider store={mockStore}>
                <Router history={history}>
                    <Footer />
                </Router>
            </Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    })
});
