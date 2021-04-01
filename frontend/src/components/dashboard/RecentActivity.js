import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ListActivity from './ListActivity';
import { sortArray } from '../../utils/findUtil';
import { getRecentActivity } from '../../actions/group';
import Spinner from '../landingPage/Spinner';

const RecentActivity = ({
  group: { recentactivity },
  user,
  getRecentActivity,
}) => {
  useEffect(() => {
    if (user) {
      getRecentActivity();
    }
  }, [getRecentActivity, user]);
  return recentactivity === null ? (
    <Spinner />
  ) : (
    <div>
      <div className='center-bars' style={{ float: 'left', clear: 'none' }}>
        <div className='dashboard'>
          <div className='topbar'>
            <h1>Recent Activity</h1>
          </div>
          <ul>
            {recentactivity && !recentactivity.myactivity.length && (
              <>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '50px',
                    color: '#aaa',
                  }}
                >
                  No activity to show
                </div>{' '}
              </>
            )}

            {user &&
              recentactivity &&
              sortArray(recentactivity.myactivity).map((ele) => (
                <li key={ele.idActivity}>
                  <ListActivity
                    description={ele.action}
                    groupName={ele.gName}
                    date={ele.date}
                    by={ele.actionByName}
                    userWith={ele.actionWithName}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

RecentActivity.propTypes = {
  user: PropTypes.array,

  getRecentActivity: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
};

RecentActivity.defaultProps = {
  user: null,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  dashboard: state.dashboard,
  group: state.group,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { getRecentActivity })(RecentActivity);
