import React from 'react';
import PropTypes from 'prop-types';
import { getMonthDate } from '../../utils/findUtil';

const ListExpenses = ({
  description,
  paidAmount,
  lentAmount,
  paidby,
  lent,
  date,
  currency,
  cls,
}) => {
  const dt = new Date(date);
  return (
    <div
      data-testid='listexpense'
      className='expense'
      style={{ height: '70%' }}
    >
      <div className='main-block'>
        <div
          className='date'
          style={{
            color: '#999',
            textTransform: 'uppercase',
            fontSize: '12px',
            height: '35px',
            width: '35px',
            float: 'left',
          }}
        >
          {getMonthDate(dt.getMonth())}
          <div
            className='number'
            style={{
              color: '#999',
              fontSize: '20px',
            }}
          >
            {dt.getDate()}
          </div>
        </div>
        <i
          className='fas fa-receipt'
          style={{
            fontSize: '25px',
            color: '#555555',
            marginTop: '5%',
            opacity: '0.6',
          }}
        />
        &nbsp;
        {description}
      </div>
      <div
        className='cost'
        style={{
          color: '#aaa',
          padding: '11px 10px 12px 50px',
          overflow: 'hidden',
          float: 'left',
          clear: 'none',
        }}
      >
        &nbsp;
        {paidby}
        <br />
        <span
          className='number'
          style={{ fontSize: '16px', color: '#000', fontWeight: 'bold' }}
        >
          &nbsp;
          {currency}
          {paidAmount}
        </span>
      </div>
      <div
        className='you'
        style={{
          color: '#aaa',
          padding: '11px 10px 12px 50px',
          overflow: 'hidden',
        }}
      >
        &nbsp;
        {lent}
        &nbsp;
        <span
          data-testid='amount'
          className={cls}
          style={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          {currency}
          {lentAmount}
        </span>
      </div>
    </div>
  );
};

ListExpenses.propTypes = {
  description: PropTypes.string.isRequired,
  paidAmount: PropTypes.number.isRequired,
  lentAmount: PropTypes.number.isRequired,
  paidby: PropTypes.string.isRequired,
  lent: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  cls: PropTypes.string.isRequired,
};

export default ListExpenses;
