import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import GroupBalanceList from './GroupBalanceList';
import '@testing-library/jest-dom';

test('renders expense list properly', () => {
  const { getByTestId } = render(
    <GroupBalanceList
      cls='negative'
      email='joe@gmail.com'
      amount={100}
      csymbol='$'
      imgSrc='https://www.google.com/url?sa=i&url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTML%2FElement%2Fimg&psig=AOvVaw2iFeMaA0WFPJJfef6CAheY&ust=1616279868669000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKiegu21ve8CFQAAAAAdAAAAABAN'
      txt='gets back'
    />
  );
  expect(getByTestId('groupbalance')).toHaveTextContent(
    'joe@gmail.comgets back$ 100'
  );
});
