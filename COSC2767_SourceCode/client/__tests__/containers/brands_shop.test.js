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
import BrandsShop from '../../app/containers/BrandsShop';

// Add thunk middleware to handle async actions
const mockStore = configureStore([thunk]);

// Mock the components with correct paths
jest.mock('../../app/components/Common/LoadingIndicator', () => () => 'LoadingIndicator');
jest.mock('../../app/components/Common/NotFound', () => () => 'NotFound');
jest.mock('../../app/components/Store/ProductList', () => {
  const ProductList = ({ products }) => (
    <div data-testid="product-list">
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
  return ProductList;
});

// Mock actions
jest.mock('../../app/actions', () => ({
  ...jest.requireActual('../../app/actions'),
  filterProducts: (filter, slug) => dispatch => {
    dispatch({
      type: 'FILTER_PRODUCTS',
      payload: { filter, slug }
    });
  }
}));

describe('BrandsShop component', () => {
  let store;

  const initialState = {
    product: {
      storeProducts: [],
      isLoading: false
    },
    authentication: {
      authenticated: false
    }
  };

  const mockProps = {
    match: {
      params: {
        slug: 'test-brand'
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
          <BrandsShop {...mockProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty products state correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsShop {...mockProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with products correctly', () => {
    const stateWithProducts = {
      ...initialState,
      product: {
        ...initialState.product,
        storeProducts: [
          { _id: '1', name: 'Product 1', slug: 'product-1', price: 10 },
          { _id: '2', name: 'Product 2', slug: 'product-2', price: 20 }
        ]
      }
    };
    store = mockStore(stateWithProducts);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsShop {...mockProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for authenticated user', () => {
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
          <BrandsShop {...mockProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('dispatches filterProducts on mount', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsShop {...mockProps} />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'FILTER_PRODUCTS',
      payload: { filter: 'brand', slug: 'test-brand' }
    });
  });

  it('dispatches filterProducts when slug changes', () => {
    const { rerender } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsShop {...mockProps} />
        </BrowserRouter>
      </Provider>
    );

    // Clear the actions from mount
    store.clearActions();

    // Rerender with new slug
    const newProps = {
      match: {
        params: {
          slug: 'new-brand'
        }
      }
    };

    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsShop {...newProps} />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'FILTER_PRODUCTS',
      payload: { filter: 'brand', slug: 'new-brand' }
    });
  });
});
