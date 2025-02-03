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
import Category from '../../app/containers/Category';

const mockStore = configureStore([]);

describe('Category component', () => {
  let store;

  const initialState = {
    account: {
      user: {
        role: 'ROLE_MEMBER'
      }
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders correctly for regular user', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Category />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly for admin user', () => {
    const adminState = {
      account: {
        user: {
          role: 'ROLE_ADMIN'
        }
      }
    };
    store = mockStore(adminState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Category />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
