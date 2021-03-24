/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable react/forbid-prop-types */

/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  getAllMyGroups,
  acceptGroupInvitation,
  rejectInvitation,
} from '../../actions/group';
import profilePic from '../user/profile-pic.png';

const MyGroups = ({
  getAllMyGroups,
  user,

  isAuthenticated,
  acceptGroupInvitation,
  rejectInvitation,
  group: { allMyGroups },
}) => {
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated && user) {
      getAllMyGroups();
    }
  }, [getAllMyGroups, allMyGroups]);

  return (
    <div className='allmygroups'>
      <ul>
        {allMyGroups &&
          allMyGroups.map((el) => {
            if (el.status === 0) {
              return (
                <li key={el.groupID}>
                  <div
                    style={{
                      padding: '1% 3% 1% 1%',
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
                      onClick={() =>
                        acceptGroupInvitation(`${el.groupID}`, history)
                      }
                    >
                      Accept
                    </button>
                    &emsp;
                    <button
                      type='submit'
                      className='btm btn-outline-secondary btn-md rounded'
                      onClick={() => rejectInvitation(`${el.groupID}`, history)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              );
            }

            return (
              <li key={el.groupID}>
                <div
                  style={{
                    padding: '1% 3% 1% 1%',
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
                    className='btm btn-outline-dark btn-md rounded'
                    onClick={() => rejectInvitation(`${el.groupID}`, history)}
                  >
                    Leave Group
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

MyGroups.propTypes = {
  user: PropTypes.array,
  isAuthenticated: PropTypes.bool,
  getAllMyGroups: PropTypes.func.isRequired,
  acceptGroupInvitation: PropTypes.func.isRequired,
  rejectInvitation: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
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
  getAllMyGroups,
  acceptGroupInvitation,
  rejectInvitation,
})(MyGroups);
