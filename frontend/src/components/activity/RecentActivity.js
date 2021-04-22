import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListActivity from './ListActivity';
import { sortArray } from '../../utils/findUtil';
import { getAcceptedGroups, getRecentActivity } from '../../actions/group';
import Spinner from '../landingPage/Spinner';
import Pagination from './Pagination';
import { InputLabel, MenuItem, Select, FormControl } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: '100px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  dropDown: {
    fontSize: '20px',
  },
}));

const RecentActivity = ({
  group: { recentactivity, groups, loading, activity_loading },
  getRecentActivity,
  user,
  getAcceptedGroups,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activityPerPage, setActivityPerPage] = useState(2);
  const [selectGroup, setSelectGroup] = useState('');
  const [myactivity, setMyActivity] = useState([]);
  const [myGroupActivity, setMyGroupActivity] = useState([]);
  const [mygroups, setMyGroups] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    if (user) {
      if (!groups) getAcceptedGroups();
      if (!recentactivity) getRecentActivity();
    }

    if (groups) setMyGroups(groups.mygroupList.groups);

    if (!activity_loading && !selectGroup && recentactivity) {
      setMyActivity(sortArray(recentactivity.myactivity));
    }
    if (selectGroup && !activity_loading && myactivity) {
      const groupSpecific = myactivity.filter((ele) => {
        return String(ele.groupID) === selectGroup;
      });
      setMyGroupActivity(groupSpecific);
    }
  }, [
    getRecentActivity,
    groups,
    activity_loading,
    selectGroup,
    recentactivity,
    myactivity,
    getAcceptedGroups,
    user,
  ]);

  // Get Current Activity
  const indexOfLastActivity = currentPage * activityPerPage;
  const indexOfLastFirstActivity = indexOfLastActivity - activityPerPage;
  let currentActivity;
  if (selectGroup) {
    currentActivity =
      myGroupActivity &&
      myGroupActivity.slice(indexOfLastFirstActivity, indexOfLastActivity);
  } else {
    currentActivity =
      recentactivity &&
      myactivity.slice(indexOfLastFirstActivity, indexOfLastActivity);
  }

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return activity_loading || loading || recentactivity === null ? (
    <Spinner />
  ) : (
    <div>
      <div className='center-bars' style={{ float: 'left', clear: 'none' }}>
        <div className='dashboard'>
          <div className='topbar'>
            <h1>Recent Activity</h1>
            <div
              style={{
                display: 'inline',
                float: 'right',
                paddingRight: '10%',
              }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel className={classes.dropDown}>Group</InputLabel>
                <Select
                  id='demo-simple-select-required'
                  value={selectGroup}
                  onChange={(e) => setSelectGroup(e.target.value)}
                  className={classes.selectEmpty}
                  name='groupID'
                  autoWidth
                >
                  {mygroups &&
                    mygroups.map((val) => (
                      <MenuItem key={val._id} value={val._id}>
                        {val.groupName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <ul>
            {recentactivity && !currentActivity.length && (
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

            {recentactivity &&
              currentActivity.map((ele) => (
                <li key={ele._id}>
                  <ListActivity description={ele.action} date={ele.date} />
                </li>
              ))}
          </ul>
        </div>

        <Pagination
          activityPerPage={activityPerPage}
          totalActivity={recentactivity.myactivity.length}
          paginate={paginate}
        />
        <div>
          <span
            style={{
              display: 'inline',
              width: '100px',
              float: 'right',
              marginRight: '2%',
              fontSize: '0.75rem',
            }}
          >
            Select page size
            <select
              className='form-select'
              onChange={(e) => setActivityPerPage(e.target.value)}
            >
              <option defaultValue value='2'>
                Two
              </option>
              <option value='5'>Five</option>
              <option value='10'>Ten</option>
            </select>
          </span>
        </div>
      </div>
    </div>
  );
};

RecentActivity.propTypes = {
  getRecentActivity: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  getAcceptedGroups: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  group: state.group,
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  getRecentActivity,
  getAcceptedGroups,
})(RecentActivity);
