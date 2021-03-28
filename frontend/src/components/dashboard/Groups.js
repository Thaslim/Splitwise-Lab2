/* eslint-disable react/prop-types */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import getSymbolFromCurrency from 'currency-symbol-map';
import AddBillPopUp from '../expenses/AddBillPopUp';
import { getGroupActivity } from '../../actions/group';
import { findInArray, findbyID, sortArray } from '../../utils/findUtil';
import Spinner from '../landingPage/Spinner';
import profilePic from '../user/profile-pic.png';
import SettleUp from '../expenses/SettleUp';
import ListExpenses from './ListExpenses';
import { roundToTwo } from '../../utils/calc';
import GroupBalanceList from './GroupBalanceList';

const Groups = ({
  group: { groupActivity },
  dashboard: { acceptedGroups },
  match,
  user,
  getGroupActivity,
  isAuthenticated,
}) => {
  const [billPopUp, setBillPopUp] = useState(false);
  const [settleUp, setSettleUp] = useState(false);
  const [cSymbol, setCSymbol] = useState('');
  const [oweNames, setOweNames] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImg, setGroupImg] = useState('');
  const history = useHistory();
  useEffect(() => {
    if (isAuthenticated && user) {
      setCSymbol(getSymbolFromCurrency(user[0].userCurrency));

      if (!acceptedGroups) history.push('/dashboard');

      getGroupActivity(match.params.id);
    }

    if (acceptedGroups && acceptedGroups.mygroupList.groups.length > 0) {
      const groupInfo = findbyID(
        acceptedGroups.mygroupList.groups,
        match.params.id
      );
      setGroupImg(
        groupInfo[0].groupPicture
          ? `/static/uploaded_images/groups/${groupInfo[0].groupPicture}`
          : profilePic
      );
      setGroupName(groupInfo[0].groupName);
    }

    // if (summary) {
    //   // eslint-disable-next-line no-unused-vars
    //   const owes = summary.summary.map((val) => {
    //     if (Object.values(val)[0] < 0) {
    //       const memName = findInArray(
    //         acceptedGroups.acceptedMembers,
    //         Object.keys(val)[0]
    //       );
    //       setOweNames((oweNames) => [
    //         ...oweNames,
    //         {
    //           name: memName.memberName,
    //           bal: Object.values(val)[0],
    //           pic: memName.userPicture,
    //           email: memName.memberEmail,
    //         },
    //       ]);
    //       return Object.values(val)[0];
    //     }
    //     return 0;
    //   });
    // }
  }, [getGroupActivity, match, acceptedGroups, isAuthenticated, user, history]);
  return groupActivity === null ? (
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
              <button
                type='button'
                className='btn btn-large bg-teal text-white'
                onClick={() => {
                  setSettleUp(true);
                }}
              >
                Settle up
              </button>
              &emsp;
            </div>
          </div>
          <ul>
            {!groupActivity.groups.length && (
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
              groupActivity.groups &&
              sortArray(groupActivity.groups).map((ele) => {
                let paid;
                let lent;
                let cls;

                const paidAmount = ele.amount;
                const lentAmount = roundToTwo(
                  (paidAmount / groupActivity.memCount) *
                    (groupActivity.memCount - 1)
                );
                if (ele.paidByEmail === user[0].userEmail) {
                  paid = 'you paid';
                  lent = 'you lent';
                  cls = 'positive';
                } else {
                  paid = `${ele.paidByEmail.slice(0, 5)} paid`;
                  lent = `${ele.paidByEmail.slice(0, 5)} lent you`;
                  cls = 'negative';
                }
                return (
                  <li key={ele.idExpenses}>
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
                mygroups={acceptedGroups && acceptedGroups.mygroupList}
                currency={cSymbol}
              />
            </>
          )}
          {settleUp && (
            <>
              <SettleUp
                settleUp={settleUp}
                setSettleUp={setSettleUp}
                mygroups={acceptedGroups && acceptedGroups.mygroupList}
                currency={cSymbol}
                oweNames={oweNames}
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
          {groupActivity &&
            groupActivity.groupMemberBalance.map((ele) => {
              let cls;
              let txt;
              if (ele.total > 0) {
                cls = 'negative';
                txt = 'owes';
              } else if (ele.total < 0) {
                cls = 'positive';
                txt = 'gets back';
              } else {
                cls = 'neutral';
                txt = 'settled up';
              }
              const picture =
                acceptedGroups &&
                findInArray(acceptedGroups.acceptedMembers, ele.memberEmail);

              return (
                <li key={ele.idGroupMembers}>
                  <GroupBalanceList
                    imgSrc={picture}
                    cls={cls}
                    amount={Math.abs(ele.total)}
                    csymbol={cSymbol}
                    email={ele.memberEmail}
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
  user: PropTypes.array,
  isAuthenticated: PropTypes.bool,
  getGroupActivity: PropTypes.func.isRequired,
  dashboard: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
};

Groups.defaultProps = {
  user: null,
  isAuthenticated: false,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  dashboard: state.dashboard,
  group: state.group,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  getGroupActivity,
})(Groups);
