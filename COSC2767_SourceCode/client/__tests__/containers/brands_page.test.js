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
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import BrandsPage from '../../app/containers/BrandsPage';

// Add thunk middleware to handle async actions
const mockStore = configureStore([thunk]);

// Mock the components with correct paths
jest.mock('../../app/components/Common/LoadingIndicator', () => () => 'LoadingIndicator');
jest.mock('../../app/components/Common/NotFound', () => () => 'NotFound');
jest.mock('../../app/components/Store/BrandList', () => {
  const BrandList = ({ brands }) => (
    <div data-testid="brand-list">
      {brands?.map(brand => (
        <div key={brand._id}>{brand.name}</div>
      )) || 'No brands'}
    </div>
  );
  return BrandList;
});

// Mock the actions
jest.mock('../../app/actions', () => ({
  fetchStoreBrands: () => ({ type: 'FETCH_STORE_BRANDS' })
}));

describe('BrandsPage component', () => {
  let store;

  const initialState = {
    brand: {
      brands: [],
      isLoading: false,
      error: null
    },
    product: {
      storeProducts: []
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(initialState);
  });

  it('renders loading state correctly', () => {
    const loadingState = {
      ...initialState,
      brand: {
        ...initialState.brand,
        isLoading: true
      }
    };
    store = mockStore(loadingState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsPage />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty brands state correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsPage />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with brands correctly', () => {
    const stateWithBrands = {
      ...initialState,
      brand: {
        ...initialState.brand,
        brands: [
          { _id: '1', name: 'Brand 1', slug: 'brand-1', description: 'Description 1', isActive: true },
          { _id: '2', name: 'Brand 2', slug: 'brand-2', description: 'Description 2', isActive: true }
        ],
        isLoading: false
      }
    };
    store = mockStore(stateWithBrands);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsPage />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error state correctly', () => {
    const errorState = {
      ...initialState,
      brand: {
        ...initialState.brand,
        error: 'Failed to load brands'
      }
    };
    store = mockStore(errorState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsPage />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('dispatches fetchStoreBrands on mount', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BrandsPage />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'FETCH_STORE_BRANDS' });
  });
});
