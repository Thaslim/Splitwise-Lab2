/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable comma-dangle */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */

import React, { useState, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import path from 'path';
import { connect } from 'react-redux';
import PropTypes, { object } from 'prop-types';

import splitwiselogo from '../landingPage/splitwise.svg';

import { getAllUsers, createNewGroup } from '../../actions/group';
import profilePic from '../user/profile-pic.png';
import FreeSolo from './AutocompleteInput';

const CreateGroup = ({
  createNewGroup,
  user,
  getAllUsers,
  registeredUsersList,
}) => {
  const [visibility, setvisibility] = useState('hidden');
  const [maxHeight, setmaxHeight] = useState('0');
  const [groupName, setGroupName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState(profilePic);
  const blankMember = {
    index: Math.random(),
    memberName: '',
    memberEmail: '',
    memberPicture: '',
  };

  const [groupMembers, setGroupMembers] = useState([{ ...blankMember }]);
  const history = useHistory();
  useEffect(() => {
    getAllUsers();
    if (user && user[0].userPicture) {
      setFilePath(
        path.join('/static/uploaded_images/users', user[0].userPicture)
      );
    }
  }, [user, createNewGroup, groupMembers]);

  const addRow = () => {
    setGroupMembers([...groupMembers, { ...blankMember }]);
  };

  const clickOnDelete = (records) => {
    const filtered = groupMembers.filter((value) => value !== records);
    setGroupMembers((groupMembers) => [...filtered]);
  };
  // Extract registered names and emails as an array
  const nameList = registeredUsersList.map((a) => a.userName);

  const handleInputChange = (e) => {
    const [name, idx] = e.target.id.split('-');

    const updatedMembers = [...groupMembers];
    updatedMembers[idx][name] = e.target.value;
    setGroupMembers(updatedMembers);
  };

  const suggestionSelected = (e, value) => {
    const [, idx] = e.target.id.split('-');
    const selectedUser = registeredUsersList.filter(
      (a) => a.userName === value
    );
    const updatedMembers = [...groupMembers];
    updatedMembers[idx].memberName = value;
    updatedMembers[idx].memberEmail = selectedUser[0].userEmail;

    if (selectedUser[0].userPicture) {
      updatedMembers[
        idx
      ].memberPicture = `/static/uploaded_images/users/${selectedUser[0].userPicture}`;
    }
    setGroupMembers(updatedMembers);
  };

  const secondaryFields = () => {
    setvisibility('visible');
    setmaxHeight('none');
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const groupData = new FormData();

    groupData.append('groupName', groupName);
    groupData.append('groupMembers', JSON.stringify(groupMembers));
    groupData.append('selectedFile', selectedFile);
    createNewGroup(groupData, history);
  };

  return (
    <div className='container-fluid'>
      <div className='center-form'>
        <div className='img-class'>
          <Link className='brand-image' to='/new-group'>
            <img
              style={{ width: '200px', height: '200px' }}
              src={splitwiselogo}
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
          <h2>START A NEW GROUP</h2>
          <br />
          <form id='new_group' onSubmit={onSubmit}>
            <p style={{ fontSize: '24px' }}>My group shall be called…</p>
            <input
              className='form-control'
              autoComplete='off'
              style={{
                fontSize: '32px',
                height: '42px',
              }}
              onChange={secondaryFields}
              onKeyUp={secondaryFields}
              type='text'
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              name='groupName'
              id='group_name'
            />

            <div className='secondaryFields' style={{ visibility, maxHeight }}>
              <h2>GROUP MEMBERS</h2>

              <div className='groupMembers'>
                <p style={{ float: 'left' }}>
                  <img src={filePath} alt='profilePic' />
                  &emsp;
                  {user && user[0].userName} (
                  <em>{user && user[0].userEmail}</em>)
                </p>
              </div>
              <div className='pt-5'>
                <table>
                  <tbody>
                    {groupMembers.map((val, idx) => (
                      <tr key={val.index}>
                        <td>
                          <FreeSolo
                            idx={idx}
                            members={groupMembers}
                            userList={nameList}
                            handleInputChange={handleInputChange}
                            vals={val}
                            onDelete={clickOnDelete}
                            suggestionSelected={suggestionSelected}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot colSpan='4'>
                    <tr>
                      <td>
                        <button
                          onClick={addRow}
                          type='button'
                          className='btn btn-primary text-center btn-sm'
                        >
                          <i className='fa fa-plus-circle' aria-hidden='true' />
                          Add Person
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <br />
            <input
              type='submit'
              className='btn btn-lg btn-danger'
              value='Save'
            />
          </form>
        </div>
      </div>
    </div>
  );
};

CreateGroup.propTypes = {
  createNewGroup: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  registeredUsersList: PropTypes.arrayOf(object),
  user: PropTypes.arrayOf(object),
};
CreateGroup.defaultProps = {
  user: null,
  registeredUsersList: [],
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  registeredUsersList: state.group.registeredUsersList,
});
export default connect(mapStateToProps, { createNewGroup, getAllUsers })(
  CreateGroup
);
