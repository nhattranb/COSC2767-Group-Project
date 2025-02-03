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
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Notification from '../../app/containers/Notification';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Notification component', () => {
  let store;

  const initialState = {
    notification: {
      message: '',
      type: '',
      isVisible: false
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders correctly when hidden', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders success notification correctly', () => {
    const successState = {
      notification: {
        message: 'Success message',
        type: 'success',
        isVisible: true
      }
    };
    store = mockStore(successState);

    const { asFragment } = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error notification correctly', () => {
    const errorState = {
      notification: {
        message: 'Error message',
        type: 'error',
        isVisible: true
      }
    };
    store = mockStore(errorState);

    const { asFragment } = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 