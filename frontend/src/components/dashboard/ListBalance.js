import React from 'react';
import PropTypes from 'prop-types';

const ListBalance = ({
  cls,
  name,
  amount,
  csymbol,
  groupNames,
  imgSrc,
  txt,
}) => (
  <div
    data-testid='listbalance'
    className='groupMembers'
    style={{ textAlign: 'left' }}
  >
    <div>
      <strong
        style={{
          paddingLeft: '2%',
          marginRight: '-35%',
        }}
      >
        <img src={imgSrc} alt='Avatar' />
        &emsp;
        {name}
        <span className={cls} style={{ paddingLeft: '2%', display: 'inline' }}>
          {txt} &nbsp;
          {csymbol}
          {amount}
        </span>
      </strong>
      {groupNames[name].map((el) => {
        return (
          <ul
            key={Math.random()}
            className='neutral'
            style={{ paddingLeft: '14.5%' }}
          >
            {txt === 'owes you' && (
              <>
                {name} {txt} &nbsp;
                <span className={cls} style={{ display: 'inline' }}>
                  {csymbol}
                  {el.amount}
                </span>
                &nbsp; for "{el.groupName}"
              </>
            )}
            {txt === 'you owe' && (
              <>
                {txt} {name} &nbsp;
                <span className={cls} style={{ display: 'inline' }}>
                  {csymbol}
                  {el.amount}
                </span>
                &nbsp; for "{el.groupName}"
              </>
            )}
          </ul>
        );
      })}
    </div>
  </div>
);

ListBalance.propTypes = {
  cls: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  csymbol: PropTypes.string.isRequired,
  txt: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  groupNames: PropTypes.object,
};
ListBalance.defaultProps = {
  name: '',
  groupNames: {},
};
export default ListBalance;
