import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Contact from '../../app/containers/Contact';

const mockStore = configureStore([]);

describe('Contact component', () => {
  let store;
  
  const initialState = {
    contact: {
      contactFormData: {
        name: '',
        email: '',
        message: ''
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
        <Contact />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with form errors', () => {
    const stateWithErrors = {
      contact: {
        ...initialState.contact,
        formErrors: {
          name: 'Name is required',
          email: 'Invalid email',
          message: 'Message is required'
        }
      }
    };
    store = mockStore(stateWithErrors);

    const { asFragment } = render(
      <Provider store={store}>
        <Contact />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with form data', () => {
    const stateWithData = {
      contact: {
        contactFormData: {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message'
        },
        formErrors: {}
      }
    };
    store = mockStore(stateWithData);

    const { asFragment } = render(
      <Provider store={store}>
        <Contact />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
