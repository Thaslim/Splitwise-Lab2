import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render } from '@testing-library/react';
import ListActivity from './ListActivity';
import '@testing-library/jest-dom';

test('renders Activity item properly', () => {
  const { getByTestId } = render(
    <ListActivity
      date={new Date().toDateString()}
      description={'Sally added $120 to "Team event" group'}
    />
  );
  expect(getByTestId('listActivity')).toHaveTextContent(
    'Apr22 Sally added $120 to "Team event" group'
  );
});
