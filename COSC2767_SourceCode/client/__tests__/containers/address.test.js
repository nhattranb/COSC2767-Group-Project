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
import Address from '../../app/containers/Address';

const mockStore = configureStore([]);

// Mock the sub-components
jest.mock('../../app/containers/Address/List', () => () => 'List Component');
jest.mock('../../app/containers/Address/Add', () => () => 'Add Component');
jest.mock('../../app/containers/Address/Edit', () => () => 'Edit Component');
jest.mock('../../app/components/Common/Page404', () => () => 'Page404 Component');

describe('Address component', () => {
  let store;

  const initialState = {
    account: {
      user: {
        _id: '123',
        role: 'ROLE_MEMBER'
      }
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders address dashboard correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Address />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders add address route correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Address />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders edit address route correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Address />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 
