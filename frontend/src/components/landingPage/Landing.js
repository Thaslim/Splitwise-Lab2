import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import heartImg from './heartImg.png';
import planeImg from './planeImg.png';
import houseImg from './purple-house.png';
import starImg from './starImg.png';

const Landing = ({ isAuthenticated }) => {
  const images = {
    planeImg,
    heartImg,
    houseImg,
    starImg,
  };
  const [landingImage, setLandingImage] = useState(images.planeImg);
  const [landingText, setlandingText] = useState('on trips.');
  const [fontColor, setFontColor] = useState('#1cc29f');

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='container-fluid bgImg'>
      <div className='row'>
        <div className='col-lg-6'>
          <h1 className='landingpage-content'>
            <span className='text-swap-plane' id='plane'>
              Less stress when sharing expenses{' '}
              <span style={{ color: fontColor }}>{landingText}</span>
            </span>
          </h1>

          <ul className='side-by-side items-center'>
            <li className='sm-icon sm-plane text-teal'>
              <Link to='/' className='text-teal nav-icon' data-item='plane'>
                <i
                  onMouseEnter={() => {
                    setLandingImage(images.planeImg);
                    setlandingText('on trips.');
                    setFontColor('#1cc29f');
                  }}
                  className='fas fa-plane'
                />
              </Link>
            </li>
            <li className='sm-icon sm-home text-purple'>
              <Link to='/' className='text-purple nav-icon' data-item='home'>
                <i
                  onMouseEnter={() => {
                    setLandingImage(images.houseImg);
                    setlandingText('with housemates.');
                    setFontColor('#8656cd');
                  }}
                  className='fas fa-home'
                />
              </Link>
            </li>
            <li className='sm-icon sm-heart text-red'>
              <Link to='/' className='text-red nav-icon' data-item='heart'>
                <i
                  onMouseEnter={() => {
                    setLandingImage(images.heartImg);
                    setlandingText('with your partner.');
                    setFontColor('#a6002f');
                  }}
                  className='fas fa-heart'
                />
              </Link>
            </li>
            <li className='sm-icon text-charcoal sm-any'>
              <Link
                to='/'
                className='text-charcoal nav-icon'
                data-item='star-of-life'
              >
                <i
                  onMouseEnter={() => {
                    setLandingImage(images.starImg);
                    setlandingText('with anyone.');
                    setFontColor('#1cc29f');
                  }}
                  className='fas fa-star-of-life'
                />
              </Link>
            </li>
          </ul>
          <p>
            Keep track of your shared expenses and balances with housemates,
            trips, groups, friends, and family.
          </p>
          <Link
            style={{ backgroundColor: fontColor }}
            className='btn btn-lg text-white'
            to='/signup'
          >
            Sign up
          </Link>
          <p className='mt-8 text-charcoal text-sm items-center free'>
            Free for <i className='fab fa-apple' /> iPhone,{' '}
            <i className='fab fa-android' /> Android and Web
          </p>
        </div>
        <div className='col-lg-6 center-img'>
          <img className='dash-images' src={landingImage} alt='landingImage' />
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

Landing.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
