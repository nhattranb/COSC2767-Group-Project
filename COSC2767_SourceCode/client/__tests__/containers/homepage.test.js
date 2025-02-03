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
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Homepage from '../../app/containers/Homepage';

const mockStore = configureStore([thunk]);

// Mock components
jest.mock('../../app/components/Store/ProductList', () => () => 'ProductList Component');
jest.mock('../../app/components/Common/LoadingIndicator', () => () => 'LoadingIndicator');

describe('Homepage component', () => {
  let store;

  const initialState = {
    product: {
      storeProducts: [],
      isLoading: false
    },
    brand: {
      storeBrands: []
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
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
          <Homepage />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with products correctly', () => {
    const stateWithProducts = {
      ...initialState,
      product: {
        storeProducts: [
          { _id: '1', name: 'Product 1' },
          { _id: '2', name: 'Product 2' }
        ],
        isLoading: false
      }
    };
    store = mockStore(stateWithProducts);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Homepage />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
