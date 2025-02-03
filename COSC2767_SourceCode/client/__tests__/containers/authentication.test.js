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
import Authentication from '../../app/containers/Authentication';

const mockStore = configureStore([]);

describe('Authentication HOC', () => {
  let store;
  
  const DummyComponent = () => <div>Protected Component</div>;
  const WrappedComponent = Authentication(DummyComponent);

  beforeEach(() => {
    store = mockStore({
      authentication: {
        authenticated: false
      }
    });
  });

  it('redirects to login when not authenticated', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <WrappedComponent />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders protected component when authenticated', () => {
    store = mockStore({
      authentication: {
        authenticated: true
      }
    });

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <WrappedComponent />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
}); 
