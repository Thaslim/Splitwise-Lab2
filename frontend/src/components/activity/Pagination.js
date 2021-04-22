import React from 'react';

const Pagination = ({ activityPerPage, totalActivity, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalActivity / activityPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{
        marginTop: '1%',
        marginBottom: '1%',
        width: '60%',
        float: 'left',
      }}
    >
      <ul className='pagination'>
        &nbsp;
        {pageNumbers.map((number) => (
          <li key={number} className='page-item'>
            <button
              onClick={() => paginate(number)}
              className='page-link'
              style={{ color: '#1cc29f' }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
