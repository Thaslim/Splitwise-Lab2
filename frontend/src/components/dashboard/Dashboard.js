import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';
import AddBillPopUp from '../bill/AddBillPopUp';
import { getAcceptedGroups } from '../../actions/group';
import { roundToTwo } from '../../utils/calc';
import ListBalance from './ListBalance';
import Spinner from '../landingPage/Spinner';
import profilePic from '../user/profile-pic.png';
import getIndividualGroupBalance from '../../utils/getGroupBalance.js';
import SettleUp from '../bill/SettleUp';

const Dashboard = ({
  group: { groupInfo, groups, loading },
  user,
  getAcceptedGroups,
  isAuthenticated,
}) => {
  const [billPopUp, setBillPopUp] = useState(false);
  const [settleUp, setSettleUp] = useState(false);
  const [cSymbol, setCSymbol] = useState('');
  const [getBack, setGetBack] = useState(0.0);
  const [owe, setOwe] = useState(0.0);
  const [totalBalance, setTotalBalance] = useState(0.0);
  const [oweNames, setOweNames] = useState([]);
  const [getBackNames, setgetBackNames] = useState([]);
  const [oweToGroupNames, setOweToGroupNames] = useState([]);
  const [getBackFromGroupNames, setGetBackFromGroupNames] = useState([]);

  useEffect(() => {
    if (user) {
      setCSymbol(getSymbolFromCurrency(user.userCurrency));
    }

    if (user && loading) {
      getAcceptedGroups();
    }
    if (user && groups && groups.mygroupList.iOwe.length) {
      const uniqueIoweMembers = _(groups.mygroupList.iOwe)
        .groupBy('memberID._id')
        .map((obj, key) => ({
          memberID: key,
          memberName: obj[0].memberID.userName,
          amount: roundToTwo(_.sumBy(obj, 'amount')),
          memberPic: obj[0].memberID.userPicture || '',
        }))
        .value();
      setOweNames(uniqueIoweMembers);
      const iOweAmount = roundToTwo(_.sumBy(groups.mygroupList.iOwe, 'amount'));
      setOwe(iOweAmount);

      const memBalanceEachGroup = getIndividualGroupBalance(
        groups.mygroupList.iOwe
      );
      setOweToGroupNames(memBalanceEachGroup);
    } else {
      setOweNames([]);
      setOwe(0.0);
      setOweToGroupNames([]);
    }

    if (user && groups && groups.mygroupList.owedToMe.length) {
      const uniqueOweToMeMembers = _(groups.mygroupList.owedToMe)
        .groupBy('memberID._id')
        .map((obj, key) => ({
          memberID: key,
          memberName: obj[0].memberID.userName,
          amount: roundToTwo(_.sumBy(obj, 'amount')),
          memberPic: obj[0].memberID.userPicture || '',
        }))
        .value();

      setgetBackNames(uniqueOweToMeMembers);

      const getBackAmount = roundToTwo(
        _.sumBy(groups.mygroupList.owedToMe, 'amount')
      );

      setGetBack(getBackAmount);

      const memBalanceEachGroup = getIndividualGroupBalance(
        groups.mygroupList.owedToMe
      );
      setGetBackFromGroupNames(memBalanceEachGroup);
    } else {
      setgetBackNames([]);
      setGetBack(0.0);
      setGetBackFromGroupNames([]);
    }
    setTotalBalance(roundToTwo(getBack - owe));
  }, [
    getAcceptedGroups,
    isAuthenticated,
    user,
    loading,
    groups,
    groupInfo,
    getBack,
    owe,
  ]);

  return loading || !groups ? (
    <Spinner />
  ) : (
    <div className='center-bars'>
      <div className='dashboard'>
        <div className='topbar'>
          <h1>Dashboard</h1>
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

        <div className='total_balances'>
          {!groups.mygroupList.groups.length && (
            <>
              <h3>Welcome to Splitwise!</h3>
              <h5>
                Splitwise helps you split bills with friends. Create a group and
                add some friends
              </h5>
            </>
          )}
          {!totalBalance && (
            <>
              <h3>Welcome to Splitwise!</h3>
              <h5>Add an expense to get started!</h5>
            </>
          )}
          <div className='row'>
            <div className='col block'>
              <div className='title'>total balance</div>
              {groups && !totalBalance && (
                <span className='neutral'>
                  <strong>
                    {cSymbol}
                    {totalBalance}
                  </strong>
                </span>
              )}

              {groups && totalBalance > 0 && (
                <span className='positive'>
                  <strong>
                    + {cSymbol}
                    {totalBalance}
                  </strong>
                </span>
              )}
              {groups && totalBalance < 0 && (
                <span className='negative'>
                  <strong>
                    - {cSymbol}
                    {-totalBalance}
                  </strong>
                </span>
              )}
            </div>
            <div className='col block '>
              <div className='title'>you owe</div>

              {groups && !owe && (
                <span className='neutral'>
                  {cSymbol}
                  {owe}
                </span>
              )}
              {groups && owe > 0 && (
                <span className='negative'>
                  {cSymbol}
                  {owe}
                </span>
              )}
            </div>
            <div className='col block'>
              <div className='title'>you are owed</div>
              {groups && getBack > 0 && (
                <span className='positive'>
                  <strong>
                    {cSymbol}
                    {getBack}
                  </strong>
                </span>
              )}
              {groups && !getBack && (
                <span className='neutral'>
                  {cSymbol}
                  {getBack}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='container balances'>
          <div className='row'>
            <h2
              style={{ textAlign: 'left', padding: '2% 5px' }}
              className='col negatives'
            >
              you owe
            </h2>
            <h2
              className='col'
              style={{ textAlign: 'right', padding: '2% 5px' }}
            >
              you are owed
            </h2>
          </div>
        </div>
        <div className='container balances'>
          <div className='row'>
            <div className='col negatives'>
              {!owe && <span className='neutral'>You do not owe anything</span>}
              <ul>
                {owe > 0 &&
                  oweNames.map((val) => (
                    <li key={Math.random()}>
                      <ListBalance
                        name={val.memberName}
                        cls='negative'
                        amount={val.amount}
                        csymbol={cSymbol}
                        txt='you owe'
                        groupNames={oweToGroupNames}
                        imgSrc={
                          (val.memberPic && `api/images/${val.memberPic}`) ||
                          profilePic
                        }
                      />
                    </li>
                  ))}
              </ul>
            </div>

            <div className='col'>
              {!getBack && (
                <span className='neutral'>You are not owed anything</span>
              )}
              <ul>
                {getBack > 0 &&
                  getBackNames.map((val) => (
                    <li key={Math.random()}>
                      <ListBalance
                        name={val.memberName}
                        cls='positive'
                        amount={val.amount}
                        csymbol={cSymbol}
                        groupNames={getBackFromGroupNames}
                        txt='owes you'
                        imgSrc={
                          (val.memberPic && `api/images/${val.memberPic}`) ||
                          profilePic
                        }
                      />
                      <br />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
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
        {settleUp && (
          <>
            <SettleUp
              settleUp={settleUp}
              setSettleUp={setSettleUp}
              currency={cSymbol}
              oweNames={oweNames}
              getBackNames={getBackNames}
            />
          </>
        )}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  getAcceptedGroups: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {
  user: null,
  isAuthenticated: false,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  group: state.group,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  getAcceptedGroups,
})(Dashboard);
