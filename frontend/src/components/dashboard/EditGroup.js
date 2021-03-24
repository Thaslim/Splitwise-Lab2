/* eslint-disable operator-linebreak */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable object-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import path from 'path';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Spinner from '../landingPage/Spinner';
import splitwiselogo from '../landingPage/splitwise.svg';
import { editGroupInfo } from '../../actions/group';
import profilePic from '../user/profile-pic.png';

// import { getAcceptedGroups } from '../../actions/dashboard';
import { findbyID } from '../../utils/findUtil';
import { getAcceptedGroups } from '../../actions/dashboard';

const EditGroup = ({
  match,
  getAcceptedGroups,
  dashboard: { acceptedGroups, loading },
  editGroupInfo,
}) => {
  const history = useHistory();
  const [groupName, setGroupName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [groupMemInfo, setGroupMemInfo] = useState([]);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    if (!acceptedGroups) getAcceptedGroups();
    if (acceptedGroups && acceptedGroups.mygroupList.length > 0) {
      const groupDetails = findbyID(
        acceptedGroups.mygroupList,
        match.params.id
      );
      setGroupName(!groupDetails[0].groupName ? '' : groupDetails[0].groupName);

      if (groupDetails[0].groupPicture) {
        setFilePath(
          path.join(
            '/static/uploaded_images/groups',
            groupDetails[0].groupPicture
          )
        );
      }
      const MemInfo = findbyID(
        acceptedGroups.individualGroupMembers,
        match.params.id
      );
      setGroupMemInfo(...groupMemInfo, MemInfo);
    }
  }, [getAcceptedGroups, acceptedGroups, loading, match]);

  const onSaveChanges = async (e) => {
    e.preventDefault();
    const groupData = new FormData();
    groupData.append('groupName', groupName);
    groupData.append('selectedFile', selectedFile);
    editGroupInfo(match.params.id, groupData, history);
  };

  return loading && acceptedGroups === null ? (
    <Spinner />
  ) : (
    <div className='container-fluid'>
      <div className='center-form'>
        <div className='img-class'>
          <Link className='brand-image' to='/new-group'>
            <img
              style={{ width: '200px', height: '200px' }}
              src={filePath || splitwiselogo}
              alt='logo'
            />
          </Link>
        </div>
        <div className='relative'>
          <div className='groupImage'>
            <input
              id='group_pic'
              name='groupPicture'
              style={{ maxWidth: '200px' }}
              size='10'
              type='file'
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>
        </div>

        <div className='form-content'>
          <h2>EDIT GROUP SETTINGS</h2>
          <br />
          <form id='new_group' onSubmit={onSaveChanges}>
            <p style={{ fontSize: '24px' }}>My group is called…</p>
            <input
              className='form-control'
              autoComplete='off'
              style={{
                fontSize: '32px',
                height: '42px',
              }}
              type='text'
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              name='groupName'
              id='group_name'
            />
            <div>
              <h2>GROUP MEMBERS</h2>
              <br />
              <div className='groupMembers'>
                <ul>
                  {groupMemInfo.length > 0 &&
                    groupMemInfo[0].details.map((mem) => (
                      <li key={mem.memberEmail}>
                        <p>
                          <img
                            src={
                              (mem.userPicture &&
                                `/static/uploaded_images/users/${mem.userPicture}`) ||
                              profilePic
                            }
                            alt='profilePic'
                          />
                          &emsp;
                          {mem.memberName} (<em>{mem.memberEmail}</em>)
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div style={{ display: 'block' }}>
              <button
                type='button'
                className='btn btn-md btn-light'
                onClick={() => {
                  history.goBack();
                }}
              >
                Cancel
              </button>
              &emsp;
              <button type='submit' className='btn btn-md btn-danger'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EditGroup.propTypes = {
  editGroupInfo: PropTypes.func.isRequired,
  dashboard: PropTypes.object.isRequired,
  getAcceptedGroups: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  dashboard: state.dashboard,
});
export default connect(mapStateToProps, { editGroupInfo, getAcceptedGroups })(
  EditGroup
);
