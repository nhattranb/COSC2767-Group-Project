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
import Product from '../../app/containers/Product';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Product component', () => {
  let store;

  const initialState = {
    product: {
      storeProducts: [],
      product: null,
      isLoading: false
    },
    brand: {
      storeBrands: []
    },
    authentication: {
      authenticated: false
    },
    account: {
      user: null
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Product />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading state correctly', () => {
    const loadingState = {
      ...initialState,
      product: {
        ...initialState.product,
        isLoading: true
      }
    };
    store = mockStore(loadingState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Product />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with product data', () => {
    const stateWithProduct = {
      ...initialState,
      product: {
        ...initialState.product,
        product: {
          _id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100
        }
      }
    };
    store = mockStore(stateWithProduct);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Product />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 