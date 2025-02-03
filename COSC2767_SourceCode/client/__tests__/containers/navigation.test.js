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
import Navigation from '../../app/containers/Navigation';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock components
jest.mock('../../app/components/Common/Button', () => () => 'Button Component');
jest.mock('../../app/components/Store/CartList', () => () => 'CartList Component');
jest.mock('../../app/containers/Cart', () => () => 'Cart Component');
jest.mock('react-autosuggest', () => () => 'Autosuggest Component');

// Mock actions
jest.mock('../../app/actions', () => ({
  ...jest.requireActual('../../app/actions'),
  fetchStoreBrands: () => () => ({ type: 'FETCH_STORE_BRANDS' }),
  fetchStoreCategories: () => () => ({ type: 'FETCH_STORE_CATEGORIES' })
}));

describe('Navigation component', () => {
  let store;

  const initialState = {
    authentication: {
      authenticated: false
    },
    navigation: {
      isMenuOpen: false,
      isCartOpen: false
    },
    cart: {
      cartItems: []
    },
    account: {
      user: null
    },
    brand: {
      storeBrands: []
    },
    category: {
      storeCategories: []
    },
    product: {
      storeProducts: []
    },
    menu: {
      isMenuOpen: false,
      isBrandOpen: false
    },
    search: {
      suggestions: [],
      searchValue: '',
      isLoading: false
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it('renders correctly for unauthenticated user', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
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
      },
      account: {
        user: {
          role: 'ROLE_MEMBER'
        }
      }
    };
    store = mockStore(authenticatedState);
    store.dispatch = jest.fn();

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for admin user', () => {
    const adminState = {
      ...initialState,
      authentication: {
        authenticated: true
      },
      account: {
        user: {
          role: 'ROLE_ADMIN'
        }
      }
    };
    store = mockStore(adminState);
    store.dispatch = jest.fn();

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with open menu', () => {
    const openMenuState = {
      ...initialState,
      navigation: {
        ...initialState.navigation,
        isMenuOpen: true
      }
    };
    store = mockStore(openMenuState);
    store.dispatch = jest.fn();

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 
