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
import Cart from '../../app/containers/Cart';

const mockStore = configureStore([]);

describe('Cart component', () => {
  let store;

  const initialState = {
    navigation: {
      isCartOpen: true
    },
    cart: {
      cartItems: [],
      cartTotal: 0
    },
    authentication: {
      authenticated: false
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders correctly with empty cart', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly when cart is closed', () => {
    const stateWithClosedCart = {
      ...initialState,
      navigation: {
        isCartOpen: false
      }
    };
    store = mockStore(stateWithClosedCart);

    const { asFragment } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for authenticated user', () => {
    const stateWithAuth = {
      ...initialState,
      authentication: {
        authenticated: true
      }
    };
    store = mockStore(stateWithAuth);

    const { asFragment } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
