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
import Dashboard from '../../app/containers/Dashboard';
import { ROLES } from '../../app/constants';

const mockStore = configureStore([thunk]);

// Mock the components
jest.mock('../../app/components/Manager/Dashboard/Admin', () => () => 'Admin Dashboard');
jest.mock('../../app/components/Manager/Dashboard/Merchant', () => () => 'Merchant Dashboard');
jest.mock('../../app/components/Manager/Dashboard/Customer', () => () => 'Customer Dashboard');
jest.mock('../../app/components/Manager/DisabledAccount/Merchant', () => () => 'Disabled Merchant Account');
jest.mock('../../app/components/Common/LoadingIndicator', () => () => 'LoadingIndicator');

// Mock actions
jest.mock('../../app/actions', () => ({
  ...jest.requireActual('../../app/actions'),
  fetchProfile: () => dispatch => {
    dispatch({ type: 'FETCH_PROFILE' });
  }
}));

describe('Dashboard component', () => {
  let store;

  const initialState = {
    account: {
      user: {
        role: ROLES.Member,
        merchant: null
      },
      isLoading: false
    },
    dashboard: {
      isMenuOpen: false
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(initialState);
  });

  it('renders loading state correctly', () => {
    const loadingState = {
      ...initialState,
      account: {
        ...initialState.account,
        isLoading: true
      }
    };
    store = mockStore(loadingState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders admin dashboard correctly', () => {
    const adminState = {
      ...initialState,
      account: {
        ...initialState.account,
        user: {
          role: ROLES.Admin
        }
      }
    };
    store = mockStore(adminState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders merchant dashboard correctly', () => {
    const merchantState = {
      ...initialState,
      account: {
        ...initialState.account,
        user: {
          role: ROLES.Merchant,
          merchant: {
            status: 'Approved'
          }
        }
      }
    };
    store = mockStore(merchantState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders customer dashboard correctly', () => {
    const customerState = {
      ...initialState,
      account: {
        ...initialState.account,
        user: {
          role: ROLES.Member
        }
      }
    };
    store = mockStore(customerState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders disabled merchant account correctly', () => {
    const disabledMerchantState = {
      ...initialState,
      account: {
        ...initialState.account,
        user: {
          role: ROLES.Merchant,
          merchant: {
            status: 'Rejected'
          }
        }
      }
    };
    store = mockStore(disabledMerchantState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('dispatches fetchProfile on mount', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'FETCH_PROFILE' });
  });

  it('toggles dashboard menu correctly', () => {
    const openMenuState = {
      ...initialState,
      dashboard: {
        isMenuOpen: true
      }
    };
    store = mockStore(openMenuState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
