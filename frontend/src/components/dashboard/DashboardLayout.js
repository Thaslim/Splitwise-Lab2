import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../landingPage/Spinner';

const DashboardLayout = ({
  group: { groups, loading },

  user,
  isAuthenticated,
}) => {
  const [accList, setAccList] = useState([]);

  useEffect(() => {
    if (isAuthenticated && loading) return <Redirect to='/dashboard' />;
    if (groups) {
      setAccList(groups.mygroupList.groups);
    }
  }, [groups, user, loading, isAuthenticated]);

  return loading || !groups ? (
    <Spinner />
  ) : (
    <div className='side_bar'>
      <div className='row'>
        <div className='col-sm'>
          <div id='left_sidebar'>
            <NavLink
              exact
              activeClassName='color-change'
              to='/dashboard'
              className='left_sidebar'
            >
              <img
                src='/favicon.ico'
                alt='logo'
                style={{ paddingBottom: '5px', opacity: '0.5' }}
              />
              &nbsp;Dashboard
            </NavLink>
            <NavLink
              exact
              activeClassName='color-change'
              to='/activity'
              id='notifications_link'
              className='left_sidebar'
            >
              <i className='fab fa-font-awesome-flag' /> Recent activity
            </NavLink>
            <div>
              <div className='header' style={{ textTransform: 'uppercase' }}>
                Groups &emsp;
                <NavLink
                  exact
                  activeClassName='color-change'
                  to='/new-group'
                  className='left_sidebar hlink'
                >
                  <i className='fas fa-plus' /> Add
                </NavLink>
              </div>

              {!accList.length && (
                <>
                  <div className='no-groups'>
                    You do not have any groups yet.&nbsp;
                  </div>
                </>
              )}

              {accList && (
                <>
                  <ul>
                    {accList.map((group) => (
                      <li key={group._id}>
                        <NavLink
                          exact
                          activeClassName='color-change'
                          style={{ fontSize: '0.85rem' }}
                          className='left_sidebar'
                          to={`/groups/${group._id}`}
                        >
                          <i className='fas fa-tag' /> &nbsp;
                          {group.groupName}
                          &emsp;
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  group: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};
DashboardLayout.defaultProps = {
  isAuthenticated: false,
  user: null,
};
const mapStateToProps = (state) => ({
  group: state.group,
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {})(DashboardLayout);
