import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import getSymbolFromCurrency from 'currency-symbol-map';
import AddBillPopUp from '../expenses/AddBillPopUp';
import { getGroupActivity, getGroupBalances } from '../../actions/group';

import { findbyID, sortArray } from '../../utils/findUtil';
import Spinner from '../landingPage/Spinner';
import profilePic from '../user/profile-pic.png';
import ListExpenses from './ListExpenses';
import { roundToTwo } from '../../utils/calc';
import GroupBalanceList from './GroupBalanceList';

const Groups = ({
  group: { groupActivity, groups, groupBalance },
  match,
  user,
  getGroupActivity,
  getGroupBalances,
  isAuthenticated,
}) => {
  const [billPopUp, setBillPopUp] = useState(false);
  const [cSymbol, setCSymbol] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupImg, setGroupImg] = useState('');

  const history = useHistory();
  useEffect(() => {
    if (!groups) history.push('/dashboard');
    if (user) {
      setCSymbol(getSymbolFromCurrency(user.userCurrency));
      getGroupActivity(match.params.id);
      getGroupBalances(match.params.id);
    }

    if (groups && groups.mygroupList.groups.length) {
      const groupInfo = findbyID(groups.mygroupList.groups, match.params.id);
      setGroupImg(
        groupInfo[0].groupPicture
          ? `http://localhost:3000/api/images/${groupInfo[0].groupPicture}`
          : profilePic
      );
      setGroupName(groupInfo[0].groupName);
    }
  }, [
    getGroupActivity,
    getGroupBalances,
    match,
    groups,
    isAuthenticated,
    user,
    history,
  ]);
  return groupActivity === null || groupBalance === null ? (
    <Spinner />
  ) : (
    <div>
      <div className='center-bars' style={{ float: 'left', clear: 'none' }}>
        <div className='dashboard'>
          <div className='topbar'>
            <h1>
              <img
                className='userImage'
                style={{ marginLeft: '2%', marginTop: '-1%' }}
                src={groupImg}
                alt='groupPic'
              />
              &nbsp;
              <NavLink
                style={{ color: '#333', textDecoration: 'none' }}
                className='group-heading'
                to={`/my-groups/get-group/${match.params.id}`}
              >
                {groupName}
              </NavLink>
            </h1>

            <div className='actions' style={{ float: 'right' }}>
              <button
                type='button'
                className='btn btn-large text-white btn-orange'
                data-toggle='modal'
                data-target='billmodal'
                onClick={() => {
                  setBillPopUp(true);
                }}
              >
                Add an expense
              </button>
              &emsp;
            </div>
          </div>
          <ul>
            {!groupActivity.groupExpense.expenses.length && (
              <>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '50px',
                    color: '#aaa',
                  }}
                >
                  No expense to show
                </div>{' '}
              </>
            )}
            {user &&
              groupActivity.groupExpense &&
              sortArray(groupActivity.groupExpense.expenses).map((ele) => {
                let paid;
                let lent;
                let cls;
                let lentAmount;

                const paidAmount = ele.amount;

                if (ele.paidByEmail === user.userEmail) {
                  paid = 'you paid';
                  lent = 'you lent';
                  cls = 'positive';
                  lentAmount = roundToTwo(
                    (paidAmount / groupBalance.members.length) *
                      (groupBalance.members.length - 1)
                  );
                } else {
                  paid = `${ele.paidByName.slice(0, 5)} paid`;
                  lent = `${ele.paidByName.slice(0, 5)} lent you`;
                  cls = 'negative';
                  lentAmount = roundToTwo(
                    paidAmount / groupBalance.members.length
                  );
                }
                return (
                  <li key={ele._id} className='expense-pop'>
                    <ListExpenses
                      description={ele.description}
                      paidAmount={paidAmount}
                      lentAmount={lentAmount}
                      paidby={paid}
                      lent={lent}
                      date={ele.date}
                      currency={cSymbol}
                      cls={cls}
                    />
                  </li>
                );
              })}
          </ul>
          {billPopUp && (
            <>
              <AddBillPopUp
                billPopUp={billPopUp}
                setBillPopUp={setBillPopUp}
                mygroups={groups && groups.mygroupList.groups}
                currency={cSymbol}
              />
            </>
          )}
        </div>
      </div>

      <div
        style={{
          float: 'right',
          paddingLeft: '4%',
          position: 'fixed',
          display: 'inline-block',
        }}
      >
        <h2 style={{ paddingBottom: '5%' }}>Group balances</h2>
        <ul>
          {groupBalance.members &&
            groupBalance.members.map((ele) => {
              let cls;
              let txt;
              let amount;
              if (ele.give || ele.getBack) {
                const settleBal = roundToTwo(ele.getBack - ele.give);
                if (settleBal > 0.5) {
                  cls = 'positive';
                  txt = 'gets back';
                  amount = settleBal;
                } else if (settleBal < -0.5) {
                  cls = 'negative';
                  txt = 'owes';
                  amount = -settleBal;
                } else {
                  cls = 'neutral';
                  txt = 'settled up';
                }
              } else {
                cls = 'neutral';
                txt = 'settled up';
              }

              return (
                <li key={ele.memberID._id}>
                  <GroupBalanceList
                    imgSrc={ele.memberID}
                    cls={cls}
                    amount={amount}
                    csymbol={cSymbol}
                    memName={ele.memberID.userName}
                    txt={txt}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

Groups.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  getGroupActivity: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
};

Groups.defaultProps = {
  user: null,
  isAuthenticated: false,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  group: state.group,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  getGroupActivity,
  getGroupBalances,
})(Groups);
