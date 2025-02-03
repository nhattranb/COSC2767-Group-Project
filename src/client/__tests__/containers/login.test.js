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
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from '../../app/containers/Login';

const mockStore = configureStore([thunk]);

describe('Login component', () => {
  let store;

  const initialState = {
    authentication: {
      authenticated: false
    },
    login: {
      loginFormData: {
        email: '',
        password: ''
      },
      formErrors: {}
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('redirects when authenticated', () => {
    const authenticatedState = {
      ...initialState,
      authentication: {
        authenticated: true
      }
    };
    store = mockStore(authenticatedState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders form errors correctly', () => {
    const stateWithErrors = {
      ...initialState,
      login: {
        ...initialState.login,
        formErrors: {
          email: 'Email is required',
          password: 'Password is required'
        }
      }
    };
    store = mockStore(stateWithErrors);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 
