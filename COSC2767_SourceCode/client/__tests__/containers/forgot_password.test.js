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
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ForgotPassword from '../../app/containers/ForgotPassword';

const mockStore = configureStore([thunk]);

// Mock the components
jest.mock('../../app/components/Common/Input', () => ({
  type,
  error,
  label,
  name,
  placeholder,
  value,
  onInputChange
}) => (
  <input
    type={type}
    name={name}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onInputChange(name, e.target.value)}
    data-testid="email-input"
  />
));

jest.mock('../../app/components/Common/Button', () => ({
  type,
  variant,
  text,
  className
}) => (
  <button type={type} className={className} data-testid="submit-button">
    {text}
  </button>
));

// Mock actions
jest.mock('../../app/actions', () => ({
  ...jest.requireActual('../../app/actions'),
  forgotPasswordChange: (name, value) => ({
    type: 'FORGOT_PASSWORD_CHANGE',
    payload: value
  }),
  forgotPassowrd: () => dispatch => {
    dispatch({ type: 'FORGOT_PASSWORD_SUBMIT' });
  }
}));

describe('ForgotPassword component', () => {
  let store;

  const initialState = {
    authentication: {
      authenticated: false
    },
    forgotPassword: {
      forgotFormData: {
        email: ''
      },
      formErrors: {}
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(initialState);
  });

  it('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('redirects to dashboard if authenticated', () => {
    const authenticatedState = {
      ...initialState,
      authentication: {
        authenticated: true
      }
    };
    store = mockStore(authenticatedState);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders form errors correctly', () => {
    const stateWithErrors = {
      ...initialState,
      forgotPassword: {
        ...initialState.forgotPassword,
        formErrors: {
          email: 'Email is required.'
        }
      }
    };
    store = mockStore(stateWithErrors);

    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('updates email input correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'FORGOT_PASSWORD_CHANGE',
      payload: 'test@example.com'
    });
  });

  it('submits form correctly', () => {
    const stateWithEmail = {
      ...initialState,
      forgotPassword: {
        ...initialState.forgotPassword,
        forgotFormData: {
          email: 'test@example.com'
        }
      }
    };
    store = mockStore(stateWithEmail);

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    const submitButton = getByTestId('submit-button');
    fireEvent.click(submitButton);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'FORGOT_PASSWORD_SUBMIT'
    });
  });

  it('renders with existing email value', () => {
    const stateWithEmail = {
      ...initialState,
      forgotPassword: {
        ...initialState.forgotPassword,
        forgotFormData: {
          email: 'test@example.com'
        }
      }
    };
    store = mockStore(stateWithEmail);

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = getByTestId('email-input');
    expect(emailInput.value).toBe('test@example.com');
  });

  it('renders return to login link', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    const loginLink = container.querySelector('.redirect-link');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
