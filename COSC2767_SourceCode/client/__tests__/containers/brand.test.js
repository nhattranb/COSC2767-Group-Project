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
import Brand from '../../app/containers/Brand';

const mockStore = configureStore([]);

// Mock the sub-components since we're testing them separately
jest.mock('../../app/containers/Brand/List', () => () => 'List Component');
jest.mock('../../app/containers/Brand/Add', () => () => 'Add Component');
jest.mock('../../app/containers/Brand/Edit', () => () => 'Edit Component');
jest.mock('../../app/components/Common/Page404', () => () => 'Page404 Component');

describe('Brand component', () => {
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

  it('renders brand dashboard for regular user', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Brand />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders brand dashboard for admin user', () => {
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
          <Brand />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
