/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import profilePic from '../user/profile-pic.png';

const GroupBalanceList = ({ cls, email, amount, csymbol, imgSrc, txt }) => {
  const src = imgSrc.userPicture
    ? `http://localhost:3000/api/images/${imgSrc.userPicture}`
    : profilePic;

  return (
    <div className='groupMembers' data-testid='groupbalance'>
      <img src={src} style={{ float: 'left' }} alt='Avatar' />
      &nbsp;
      <span style={{ fontSize: '0.85rem', display: 'inline' }}>
        <strong
          style={{
            paddingLeft: '2%',
            float: 'left',
            marginTop: '2%',
            marginRight: '-35%',
          }}
        >
          {email}
        </strong>
      </span>
      <span style={{ paddingLeft: '10%', fontSize: '11px' }}>
        {txt} &nbsp;
        <span
          data-testid='amount'
          className={cls}
          style={{ fontSize: '14px', display: 'inline' }}
        >
          {csymbol}
          {amount}
        </span>
      </span>
    </div>
  );
};

GroupBalanceList.propTypes = {
  cls: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  csymbol: PropTypes.string.isRequired,
  txt: PropTypes.string.isRequired,
  imgSrc: PropTypes.object.isRequired,
};

export default GroupBalanceList;
