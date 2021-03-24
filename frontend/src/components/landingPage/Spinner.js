import React from 'react';
import spinner from './spinner.gif';

const Spinner = () => (
  <>
    <img
      data-testid='spinner'
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </>
);

export default Spinner;
