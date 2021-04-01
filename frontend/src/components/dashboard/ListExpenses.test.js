import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render } from '@testing-library/react';
import ListExpenses from './ListExpenses';
import '@testing-library/jest-dom';

test('renders expense list properly', () => {
  const { getByTestId } = render(
    <ListExpenses
      description='Milk'
      paidAmount={72}
      lentAmount={30}
      paidby='Kelly'
      lent='john'
      date='2020-12-3'
      currency='$'
      cls='positive'
    />
  );
  expect(getByTestId('listexpense')).toHaveTextContent(
    'Dec3 Milk Kelly $72 john $30'
  );
});
