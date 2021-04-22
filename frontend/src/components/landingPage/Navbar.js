import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import capitalize from '../../utils/capitalize';
import splitwiselogo from './splitwise.svg';
import profilePic from '../user/profile-pic.png';

// eslint-disable-next-line object-curly-newline
const Navbar = ({ user, isAuthenticated, loading, logout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fp, setFp] = useState('');
  const [nameFormat, setNameFormat] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.userName) {
        setNameFormat(capitalize(user.userName));
      }
      if (user.userPicture) {
        setFp(`http://localhost:8000/api/images/${user.userPicture}`);
      } else {
        setFp(profilePic);
      }
    }
  }, [isAuthenticated, loading, user]);

  const toggleOpen = () => {
    setMenuOpen(!menuOpen);
  };

  const menuClass = `dropdown-menu${menuOpen ? ' show' : ''}`;
  const loggedInLinks = (
    <ul className='navbar-nav ms-auto'>
      <li className='nav-item dropdown'>
        <button
          onClick={toggleOpen}
          className='nav-link dropdown-toggle rounded-pill border border-light'
          id='navbarDropdown'
          data-toggle='dropdown'
        >
          {user && <img src={fp} className='userImage' alt='prfilePic' />}
          &nbsp;
          {user && nameFormat}
        </button>

        <div className={menuClass} aria-labelledby='navbarDropdown'>
          <Link className='dropdown-item' to='/me'>
            Your account
          </Link>
          <Link className='dropdown-item' to='/new-group'>
            Create a group
          </Link>
          <Link className='dropdown-item' to='/my-groups'>
            My groups
          </Link>
          <Link onClick={logout} className='dropdown-item' to='/'>
            Log out
          </Link>
        </div>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul className='navbar-nav ms-auto'>
      <li className='nav-item'>
        <Link className='text-teal nav-link' aria-current='page' to='/login'>
          Log in
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='bg-teal nav-link text-white rounded shadow btn btn-md'
          to='/signup'
        >
          Sign up
        </Link>
      </li>
    </ul>
  );
  const link = isAuthenticated ? '/dashboard' : '/';
  return (
    <div className='container-fluid'>
      <nav className='navbar navbar-expand-md navbar-light bg-white'>
        <Link className='navbar-brand' to={link}>
          <img
            src={splitwiselogo}
            style={{ width: '50px', height: '50px' }}
            alt='logo'
          />
          Splitwise
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarSupportedContent'
        >
          {!loading && <>{isAuthenticated ? loggedInLinks : guestLinks}</>}
        </div>
      </nav>
    </div>
  );
};
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool,
  user: PropTypes.object,
};
Navbar.defaultProps = {
  isAuthenticated: false,
  loading: true,
  user: {},
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { logout })(Navbar);
