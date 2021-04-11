import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../landingPage/Spinner';
import splitwiselogo from '../landingPage/splitwise.svg';
import { editGroupInfo } from '../../actions/group';
import profilePic from '../user/profile-pic.png';
import { findbyID } from '../../utils/findUtil';

const EditGroup = ({
  match,
  group: { groups, loading, groupBalance },
  editGroupInfo,
}) => {
  const history = useHistory();
  const [groupName, setGroupName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [groupMemInfo, setGroupMemInfo] = useState([]);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    if (!groups) history.push('/dashboard');
    if (groups && groups.mygroupList.groups.length) {
      const groupDetails = findbyID(groups.mygroupList.groups, match.params.id);
      setGroupName(!groupDetails[0].groupName ? '' : groupDetails[0].groupName);

      if (groupDetails[0].groupPicture) {
        setFilePath(
          `http://localhost:3000/api/images/${groupDetails[0].groupPicture}`
        );
      }
    }

    if (groupBalance) {
      setGroupMemInfo(groupBalance.members);
    }
  }, [match, groups, groupBalance, history]);

  const onSaveChanges = async (e) => {
    e.preventDefault();
    const groupData = new FormData();
    groupData.append('groupID', match.params.id);
    groupData.append('groupName', groupName);
    groupData.append('selectedFile', selectedFile);
    editGroupInfo(groupData, history);
  };

  return loading || !groupBalance ? (
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
                  {groupMemInfo.length &&
                    groupMemInfo.map((mem) => (
                      <li key={mem.memberID._id}>
                        <p>
                          <img
                            src={
                              (mem.memberID.userPicture &&
                                `http://localhost:3000/api/images/${mem.memberID.userPicture}`) ||
                              profilePic
                            }
                            alt='profilePic'
                          />
                          &emsp;
                          {mem.memberID.userName} (
                          <em>{mem.memberID.userEmail}</em>)
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
  group: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  group: state.group,
});
export default connect(mapStateToProps, { editGroupInfo })(EditGroup);
