import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
  const dt = moment(date).local().format('YYYY-MM-DD HH:mm:ss');
  let dtDate;
  let dtMonth;
  if (moment(dt).date() === 31) {
    dtDate = 1;
    dtMonth = moment(dt).month() + 1;
  } else {
    dtDate = moment(dt).date() + 1;
    dtMonth = moment(dt).month();
  }
  return (
    <div data-testid='listexpense' className='list-group-item'>
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
          {getMonthDate(dtMonth)}
          <div
            className='number'
            style={{
              color: '#999',
              fontSize: '20px',
            }}
          >
            {dtDate}
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
          padding: '11px 10px 0px 10px',
          overflow: 'hidden',
          float: 'left',
          width: '125px',
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
          padding: '11px 10px 0px 10px',
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
