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
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Application from '../../app/containers/Application';

const mockStore = configureStore([thunk]);

// Mock the components
jest.mock('../../app/components/Common/Footer', () => () => 'Footer Component');
jest.mock('../../app/components/Common/Page404', () => () => 'Page404 Component');
jest.mock('../../app/containers/Navigation', () => () => 'Navigation Component');
jest.mock('../../app/containers/Notification', () => () => 'Notification Component');

// Mock actions
jest.mock('../../app/actions', () => ({
  ...jest.requireActual('../../app/actions'),
  fetchProfile: () => dispatch => {
    dispatch({ type: 'FETCH_PROFILE' });
  },
  handleCart: () => dispatch => {
    dispatch({ type: 'HANDLE_CART' });
  }
}));

describe('Application component', () => {
  let store;

  const initialState = {
    authentication: {
      authenticated: false
    },
    product: {
      storeProducts: []
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(initialState);
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  it('renders correctly without authentication', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with authentication', () => {
    const authenticatedState = {
      ...initialState,
      authentication: {
        authenticated: true
      }
    };
    store = mockStore(authenticatedState);
    Storage.prototype.getItem = jest.fn(() => 'mock-token');

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('dispatches fetchProfile when token exists', () => {
    Storage.prototype.getItem = jest.fn(() => 'mock-token');

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'FETCH_PROFILE' });
  });

  it('dispatches handleCart on mount', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'HANDLE_CART' });
  });

  it('handles storage event for cart items', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Application />
        </BrowserRouter>
      </Provider>
    );

    // Simulate storage event
    const storageEvent = new Event('storage');
    Object.defineProperty(storageEvent, 'key', { value: 'cart_items' });
    window.dispatchEvent(storageEvent);

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'HANDLE_CART' });
  });
});
