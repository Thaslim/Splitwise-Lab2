import React from 'react';
import PropTypes from 'prop-types';
import { getMonthDate } from '../../utils/findUtil';

const ListActivity = ({ description, date }) => {
  const dt = new Date(date);
  return (
    <div className='list-group-item' data-testid='listActivity'>
      <div>
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
        {description.includes('commented on') && (
          <i
            className='fas fa-comments-dollar'
            style={{
              fontSize: '25px',
              color: '#555555',
              marginTop: '2.5%',
              opacity: '0.6',
            }}
          ></i>
        )}
        {!description.includes('commented on') && (
          <i
            className='fas fa-receipt'
            style={{
              fontSize: '25px',
              color: '#555555',
              marginTop: '2.5%',
              opacity: '0.6',
            }}
          />
        )}
        &nbsp; {description}
      </div>
    </div>
  );
};

ListActivity.propTypes = {
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default ListActivity;
