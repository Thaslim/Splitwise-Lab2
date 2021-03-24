import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Spinner from './Spinner';
import '@testing-library/jest-dom';

test('renders expense list properly', () => {
  const { getByTestId, getByAltText } = render(<Spinner />);
  expect(getByAltText('Loading...'));
});
