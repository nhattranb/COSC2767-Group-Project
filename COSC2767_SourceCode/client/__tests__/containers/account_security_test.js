import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AccountSecurity from '../../app/containers/AccountSecurity';

const mockStore = configureStore([]);

describe('AccountSecurity component', () => {
  let store;
  
  const initialState = {
    account: {
      user: {
        firstName: 'John',
        lastName: 'Doe'
      }
    },
    resetPassword: {
      resetFormData: {
        password: '',
        confirmPassword: ''
      },
      formErrors: {}
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders correctly with empty form', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <AccountSecurity />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with form errors', () => {
    const stateWithErrors = {
      ...initialState,
      resetPassword: {
        ...initialState.resetPassword,
        formErrors: {
          password: 'Password is required',
          confirmPassword: 'Passwords do not match'
        }
      }
    };
    store = mockStore(stateWithErrors);

    const { asFragment } = render(
      <Provider store={store}>
        <AccountSecurity />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
