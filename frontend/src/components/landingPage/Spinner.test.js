import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';
import '@testing-library/jest-dom';

test('renders spinner properly', () => {
  const { getByAltText } = render(<Spinner />);
  // eslint-disable-next-line jest/valid-expect
  expect(getByAltText('Loading...'));
});
