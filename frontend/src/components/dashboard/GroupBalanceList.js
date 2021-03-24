/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import profilePic from '../user/profile-pic.png';

const GroupBalanceList = ({ cls, email, amount, csymbol, imgSrc, txt }) => {
  const src = imgSrc.userPicture
    ? `/static/uploaded_images/users/${imgSrc.userPicture}`
    : profilePic;

  return (
    <div className='groupMembers' data-testid='groupbalance'>
      <img src={src} style={{ float: 'left' }} alt='Avatar' />
      <span style={{ fontSize: '0.85rem', display: 'table' }}>
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
        {txt}
        <span data-testid='amount' className={cls} style={{ fontSize: '14px' }}>
          {csymbol} {amount}
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
  imgSrc: PropTypes.string.isRequired,
};

export default GroupBalanceList;
