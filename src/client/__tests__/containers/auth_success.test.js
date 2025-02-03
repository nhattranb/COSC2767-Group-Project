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
import AuthSuccess from '../../app/containers/AuthSuccess';

const mockStore = configureStore([]);

describe('AuthSuccess component', () => {
  let store;

  const mockProps = {
    location: {
      search: '?token=mock-jwt-token'
    }
  };

  beforeEach(() => {
    store = mockStore({
      authentication: {
        authenticated: false
      }
    });
  });

  it('renders loading state when not authenticated', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthSuccess {...mockProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('redirects when authenticated', () => {
    store = mockStore({
      authentication: {
        authenticated: true
      }
    });

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthSuccess {...mockProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
