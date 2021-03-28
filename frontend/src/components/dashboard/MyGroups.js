/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable react/forbid-prop-types */

/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchBar from 'material-ui-search-bar';
import { acceptGroupInvitation, leaveGroup } from '../../actions/group';
import { getAcceptedGroups } from '../../actions/dashboard';
import profilePic from '../user/profile-pic.png';

const MyGroups = ({
  getAcceptedGroups,
  user,
  leaveGroup,
  isAuthenticated,
  acceptGroupInvitation,
  dashboard: { groups },
}) => {
  const [accList, setAccList] = useState([]);
  const [invites, setInvites] = useState([]);
  const [searchGroup, setSearchGroup] = useState('');

  useEffect(() => {
    if (isAuthenticated && user && !groups) {
      getAcceptedGroups();
    }

    if (groups) {
      setAccList(groups.mygroupList.groups);
      setInvites(groups.mygroupList.invites);
    }
  }, [getAcceptedGroups, groups, isAuthenticated, user]);

  return (
    <div className='mygroups'>
      <div>
        <h2>Group Invites</h2>
        {!invites && 'No invitations to show'}
        <ul>
          {invites &&
            invites.map((el) => {
              return (
                <li key={el._id}>
                  <div
                    style={{
                      padding: '2% 3% 1% 1%',
                    }}
                  >
                    <img
                      className='userImage'
                      src={
                        (el.groupPicture &&
                          `/static/uploaded_images/groups/${el.groupPicture}`) ||
                        profilePic
                      }
                      alt='groupPic'
                    />
                    &nbsp;
                    {el.groupName}
                    &nbsp;
                    <button
                      type='submit'
                      className='btm btn-outline-danger btn-md rounded'
                      onClick={() => acceptGroupInvitation(`${el.groupID}`)}
                    >
                      Accept
                    </button>
                    &emsp;
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
      <div>
        <h2>Search Your Groups</h2>
        <SearchBar
          value={searchGroup}
          onChange={(newValue) => setSearchGroup(newValue)}
          // onRequestSearnpm startch={() => showGroup(searchGroup)}
        />

        {/* {accList &&
          accList.map((el) => {
            return (
              <li key={el._id}>
                <div
                  style={{
                    padding: '2% 3% 1% 1%',
                  }}
                >
                  <img
                    className='userImage'
                    src={
                      (el.groupPicture &&
                        `/static/uploaded_images/groups/${el.groupPicture}`) ||
                      profilePic
                    }
                    alt='groupPic'
                  />
                  &nbsp;
                  {el.groupName}
                  &nbsp;
                  <button
                    type='submit'
                    className='btm btn-outline-danger btn-md rounded'
                    onClick={() => leaveGroup(`${el.groupID}`)}
                  >
                    Leave Group
                  </button>
                  &emsp;
                </div>
              </li>
            );
          })} */}
      </div>
    </div>
  );
};

MyGroups.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  acceptGroupInvitation: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  dashboard: PropTypes.object.isRequired,
  getAcceptedGroups: PropTypes.func.isRequired,
};

MyGroups.defaultProps = {
  user: null,
  isAuthenticated: false,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  dashboard: state.dashboard,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  acceptGroupInvitation,
  leaveGroup,
  getAcceptedGroups,
})(MyGroups);
