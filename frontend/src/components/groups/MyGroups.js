import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar';
import {
  acceptGroupInvitation,
  getAcceptedGroups,
  leaveGroup,
} from '../../actions/group';
import { findbyName } from '../../utils/findUtil';
import profilePic from '../user/profile-pic.png';

const MyGroups = ({
  user,
  leaveGroup,
  isAuthenticated,
  getAcceptedGroups,
  acceptGroupInvitation,
  group: { groups },
}) => {
  const [accList, setAccList] = useState([]);
  const [invites, setInvites] = useState([]);
  const [searchGroup, setSearchGroup] = useState('');
  const [showGroupInfo, setShowGroupInfo] = useState([]);

  useEffect(() => {
    if (user) {
      if (!groups) getAcceptedGroups();
    }

    if (groups) {
      setAccList(groups.mygroupList.groups);
      setInvites(groups.mygroupList.invites);
    }
  }, [getAcceptedGroups, groups, isAuthenticated, user]);

  const showGroup = (value) => {
    const found = findbyName(accList, value);
    if (found) setShowGroupInfo(found);
  };

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
                          `http://localhost:8000/api/images/${el.groupPicture}`) ||
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
                      onClick={() =>
                        acceptGroupInvitation(`${el._id}`, `${el.groupName}`)
                      }
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
      <div style={{ marginTop: '3%' }}>
        <h2>Search Your Groups</h2>

        <SearchBar
          value={searchGroup}
          onChange={(newValue) => setSearchGroup(newValue)}
          onRequestSearch={() => showGroup(searchGroup)}
        />
        <br />
        <ul>
          {showGroupInfo &&
            showGroupInfo.map((el) => {
              return (
                <li key={el._id}>
                  <div
                    style={{
                      padding: '2% 3% 1% 1%',
                    }}
                  >
                    <NavLink
                      style={{ textDecoration: 'none', color: '#1cc29f' }}
                      to={`/groups/${el._id}`}
                    >
                      <img
                        className='userImage'
                        src={
                          (el.groupPicture &&
                            `http://localhost:8000/api/images/${el.groupPicture}`) ||
                          profilePic
                        }
                        alt='groupPic'
                      />
                      &nbsp;
                      {el.groupName}
                    </NavLink>
                    &nbsp;
                    <button
                      type='submit'
                      className='btm btn-outline-danger btn-md rounded'
                      onClick={() => leaveGroup(`${el._id}`, `${el.groupName}`)}
                    >
                      Leave Group
                    </button>
                    &emsp;
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

MyGroups.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  acceptGroupInvitation: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  getAcceptedGroups: PropTypes.func.isRequired,
};

MyGroups.defaultProps = {
  user: null,
  isAuthenticated: false,
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  group: state.group,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {
  acceptGroupInvitation,
  getAcceptedGroups,
  leaveGroup,
})(MyGroups);
