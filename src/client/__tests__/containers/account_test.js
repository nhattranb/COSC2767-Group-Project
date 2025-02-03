/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 3 Jan 2025
 *   Last modified: 3 Jan 2025
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Account from '../../app/containers/Account';

const mockStore = configureStore([]);

describe('Account component', () => {
  let store;

  const initialState = {
    account: {
      user: {
        firstName: 'John',
        lastName: 'Doe'
      }
    },
    resetPassword: {
      resetFormData: {},
      formErrors: {}
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders correctly with user data', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Account />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with empty user data', () => {
    const emptyState = {
      ...initialState,
      account: {
        user: {
          firstName: '',
          lastName: ''
        }
      }
    };
    store = mockStore(emptyState);

    const { asFragment } = render(
      <Provider store={store}>
        <Account />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
