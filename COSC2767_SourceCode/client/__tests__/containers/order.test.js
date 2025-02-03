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
import Order from '../../app/containers/Order';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Order component', () => {
  let store;

  const initialState = {
    order: {
      orders: [],
      isLoading: false,
      currentOrder: null
    },
    authentication: {
      authenticated: true
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders correctly', () => {
    const stateWithUser = {
      ...initialState,
      account: {
        user: {}
      }
    };
    store = mockStore(stateWithUser);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Order />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading state correctly', () => {
    const loadingState = {
      ...initialState,
      order: {
        ...initialState.order,
        isLoading: true
      }
    };
    store = mockStore(loadingState);

    const loadingStateWithUser = {
      ...loadingState,
      account: {
        user: {}
      }
    };
    store = mockStore(loadingStateWithUser);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Order />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with orders correctly', () => {
    const ordersState = {
      ...initialState,
      order: {
        ...initialState.order,
        orders: [
          {
            _id: '1',
            total: 100,
            created: new Date(),
            products: []
          }
        ]
      }
    };
    store = mockStore(ordersState);

    const ordersStateWithUser = {
      ...ordersState,
      account: {
        user: {}
      }
    };
    store = mockStore(ordersStateWithUser);
    
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Order />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 