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

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Newsletter from '../../app/containers/Newsletter';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock actions
jest.mock('../../app/actions', () => ({
  newsletterChange: jest.fn(),
  subscribeToNewsletter: jest.fn()
}));

describe('Newsletter component', () => {
  let store;

  const initialState = {
    newsletter: {
      email: '',
      isSubscribed: false
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders correctly', () => {
    const stateWithFormErrors = {
      ...initialState,
      newsletter: {
        ...initialState.newsletter,
        formErrors: {}
      }
    };
    store = mockStore(stateWithFormErrors);

    const { asFragment } = render(
      <Provider store={store}>
        <Newsletter />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders subscribed state correctly', () => {
    const subscribedState = {
      newsletter: {
        email: 'test@example.com',
        isSubscribed: true
      }
    };
    store = mockStore(subscribedState);

    const subscribedStateWithFormErrors = {
      ...subscribedState,
      newsletter: {
        ...subscribedState.newsletter,
        formErrors: {}
      }
    };
    store = mockStore(subscribedStateWithFormErrors);

    const { asFragment } = render(
      <Provider store={store}>
        <Newsletter />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 