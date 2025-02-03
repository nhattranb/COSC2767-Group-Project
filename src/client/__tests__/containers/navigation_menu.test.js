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
import NavigationMenu from '../../app/containers/NavigationMenu';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('NavigationMenu component', () => {
  let store;

  const initialState = {
    menu: {
      isMenuOpen: false,
      isBrandOpen: false
    },
    brand: {
      storeBrands: []
    },
    category: {
      storeCategories: []
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

  it('renders correctly for unauthenticated user', () => {
    const unauthenticatedStateWithNavigation = {
      ...initialState,
      navigation: {
        isMenuOpen: false
      }
    };
    store = mockStore(unauthenticatedStateWithNavigation);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <NavigationMenu />
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

    const authenticatedStateWithNavigation = {
      ...authenticatedState,
      navigation: {
        isMenuOpen: false
      }
    };
    store = mockStore(authenticatedStateWithNavigation);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <NavigationMenu />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with open menu', () => {
    const openMenuState = {
      ...initialState,
      menu: {
        isMenuOpen: true,
        isBrandOpen: false
      }
    };
    store = mockStore(openMenuState);

    const openMenuStateWithNavigation = {
      ...openMenuState,
      navigation: {
        isMenuOpen: true
      }
    };
    store = mockStore(openMenuStateWithNavigation);
    
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <NavigationMenu />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 