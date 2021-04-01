import React from 'react';
import PropTypes from 'prop-types';
import { getMonthDate } from '../../utils/findUtil';

const ListActivity = ({ description, date, groupName, by, userWith }) => {
  console.log(description);
  const dt = new Date(date);
  return (
    <div
      data-testid='listexpense'
      className='expense'
      style={{ height: '70%' }}
    >
      <div className='activity-list'>
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
        {description === 'created group' && (
          <>
            {by} &nbsp;
            {description} {groupName}
          </>
        )}
        {description === 'invited' && (
          <>
            {by} &nbsp;
            {description} {userWith} to {groupName}
          </>
        )}
        {description === 'accepted invitation' && (
          <>
            {by} &nbsp;
            {description} for {groupName}
          </>
        )}
        {description !== 'accepted invitation' &&
          description !== 'invited' &&
          description !== 'created group' && (
            <>
              {by} &nbsp;
              {description} in {groupName}
            </>
          )}
      </div>
    </div>
  );
};

ListActivity.propTypes = {
  description: PropTypes.string.isRequired,
  userWith: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  by: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default ListActivity;
