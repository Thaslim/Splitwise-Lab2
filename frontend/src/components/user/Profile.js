import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { updateUserProfile } from '../../actions/profile';
import defaultProfilePic from './profile-pic.png';
import Spinner from '../landingPage/Spinner';

const Profile = ({ user, isAuthenticated, updateUserProfile }) => {
  const [userName, setUserName] = useState();
  const [userPhone, setUserPhone] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userCurrency, setUserCurrency] = useState();
  const [userTimezone, setUserTimezone] = useState();
  const [userLanguage, setUserLanguage] = useState();
  const [showName, setShowName] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState('');

  const history = useHistory();

  useEffect(() => {
    if (user) {
      setUserName(!user.userName ? '' : user.userName);
      setUserPhone(!user.userPhone ? '' : user.userPhone);
      setUserCurrency(!user.userCurrency ? '' : user.userCurrency);
      setUserTimezone(!user.userTimezone ? '' : user.userTimezone);
      setUserLanguage(!user.userLanguage ? '' : user.userLanguage);
      setUserEmail(!user.userEmail ? '' : user.userEmail);

      if (user.userPicture) {
        setFilePath(`api/images/${user.userPicture}`);
      }
    }
  }, [isAuthenticated, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const profileData = new FormData();
    profileData.append('userName', userName);
    profileData.append('userEmail', userEmail);
    profileData.append('userTimezone', userTimezone);
    profileData.append('userCurrency', userCurrency);
    profileData.append('userLanguage', userLanguage);
    profileData.append('userPhone', userPhone);
    profileData.append('selectedFile', selectedFile);
    updateUserProfile(profileData, history);
  };

  return user === null ? (
    <Spinner />
  ) : (
    <div className='container-fluid'>
      <h1>Your account</h1>
      <br />
      <form onSubmit={(e) => onSubmit(e)}>
        <div className='row'>
          <div className='col-lg-6'>
            <div className='row'>
              <div className='col-lg-6'>
                <img
                  className='picture-frame'
                  src={
                    // eslint-disable-next-line operator-linebreak
                    user && user.userPicture ? filePath : defaultProfilePic
                  }
                  style={{ width: '200px', height: '200px' }}
                  alt='userPicture'
                />
                <div style={{ margin: '10px 0 5px' }}>Change your avatar</div>
                <input
                  id='user_pic'
                  name='userPicture'
                  style={{ maxWidth: '250px' }}
                  size='10'
                  type='file'
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className='col-lg-6'>
                <div>
                  <span>Your name </span>
                  <strong>{user && user.userName}</strong>
                  {!showName && (
                    <button
                      type='button'
                      className='btn edit-link'
                      onClick={() => setShowName(true)}
                    >
                      {' '}
                      <i className='fas fa-pencil-alt' />
                      Edit
                    </button>
                  )}

                  {showName && (
                    <input
                      autoComplete='off'
                      spellCheck='false'
                      type='text'
                      value={userName}
                      name='userName'
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                      id='user_name'
                    />
                  )}
                </div>

                <div>
                  <span>Your email address</span>
                  <strong>{user && user.userEmail}</strong>
                  {!showEmail && (
                    <button
                      type='button'
                      className='btn edit-link'
                      onClick={() => setShowEmail(true)}
                    >
                      {' '}
                      <i className='fas fa-pencil-alt' />
                      Edit
                    </button>
                  )}

                  {showEmail && (
                    <input
                      autoComplete='off'
                      spellCheck='false'
                      type='email'
                      value={userEmail}
                      name='userEmail'
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                      }}
                      id='user_email'
                    />
                  )}
                </div>

                <div>
                  <span>Your phone number </span>
                  <strong>
                    {user && (!user.userPhone ? 'None' : user.userPhone)}
                  </strong>
                  {!showPhone && (
                    <button
                      type='button'
                      className='btn edit-link'
                      onClick={() => setShowPhone(true)}
                    >
                      {' '}
                      <i className='fas fa-pencil-alt' />
                      Edit
                    </button>
                  )}

                  {showPhone && (
                    <input
                      autoComplete='off'
                      spellCheck='false'
                      type='text'
                      value={userPhone}
                      name='userPhone'
                      onChange={(e) => {
                        setUserPhone(e.target.value);
                      }}
                      id='user_phone'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='row'>
              <div className='col-lg-6'>
                <span>Your default currency</span>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    margin: '-6px 0 5px',
                  }}
                >
                  (for new expenses)
                </div>
                <div>
                  <select
                    value={userCurrency}
                    className='modernized'
                    name='userCurrency'
                    onChange={(e) => {
                      setUserCurrency(e.target.value);
                    }}
                    id='user_default_currency'
                  >
                    <option value='AED'>AED (DH)</option>
                    <option value='AFN'>AFN (Afs)</option>
                    <option value='ALL'>ALL (L)</option>
                    <option value='AMD'>AMD (AMD)</option>
                    <option value='ANG'>ANG (NAf)</option>
                    <option value='AOA'>AOA (Kz)</option>
                    <option value='ARS'>ARS ($)</option>
                    <option value='AUD'>AUD ($)</option>
                    <option value='AWG'>AWG (Afl.)</option>
                    <option value='AZN'>AZN (m.)</option>
                    <option value='BAM'>BAM (KM)</option>
                    <option value='BBD'>BBD ($)</option>
                    <option value='BDT'>BDT (Tk)</option>
                    <option value='BGN'>BGN (BGN)</option>
                    <option value='BHD'>BHD (BD)</option>
                    <option value='BIF'>BIF (FBu)</option>
                    <option value='BND'>BND (B$)</option>
                    <option value='BOB'>BOB (Bs.)</option>
                    <option value='BRL'>BRL (R$)</option>
                    <option value='BTC'>BTC (฿)</option>
                    <option value='BTN'>BTN (Nu.)</option>
                    <option value='BWP'>BWP (P)</option>
                    <option value='BYN'>BYN (Br)</option>
                    <option value='BYR'>BYR (BYR)</option>
                    <option value='BZD'>BZD (BZ$)</option>
                    <option value='CAD'>CAD ($)</option>
                    <option value='CDF'>CDF (FC)</option>
                    <option value='CHF'>CHF (Fr.)</option>
                    <option value='CLP'>CLP ($)</option>
                    <option value='CMG'>CMG (CMg)</option>
                    <option value='CNY'>CNY (¥)</option>
                    <option value='COP'>COP ($)</option>
                    <option value='CRC'>CRC (₡)</option>
                    <option value='CUC'>CUC (CUC$)</option>
                    <option value='CUP'>CUP ($)</option>
                    <option value='CVE'>CVE ($)</option>
                    <option value='CZK'>CZK (Kč)</option>
                    <option value='DJF'>DJF (Fdj )</option>
                    <option value='DKK'>DKK (kr)</option>
                    <option value='DOP'>DOP ($)</option>
                    <option value='DZD'>DZD (DA)</option>
                    <option value='EGP'>EGP (E£)</option>
                    <option value='ETB'>ETB (Br)</option>
                    <option value='EUR'>EUR (€)</option>
                    <option value='FJD'>FJD ($)</option>
                    <option value='GBP'>GBP (£)</option>
                    <option value='GEL'>GEL (GEL)</option>
                    <option value='GHS'>GHS (GH₵)</option>
                    <option value='GMD'>GMD (D)</option>
                    <option value='GTQ'>GTQ (Q)</option>
                    <option value='GYD'>GYD (G$)</option>
                    <option value='HKD'>HKD ($)</option>
                    <option value='HNL'>HNL (L)</option>
                    <option value='HRK'>HRK (HRK)</option>
                    <option value='HTG'>HTG (G)</option>
                    <option value='HUF'>HUF (Ft)</option>
                    <option value='IDR'>IDR (Rp )</option>
                    <option value='ILS'>ILS (₪)</option>
                    <option value='INR'>INR (₹)</option>
                    <option value='IQD'>IQD (IQD)</option>
                    <option value='IRR'>IRR (IRR)</option>
                    <option value='ISK'>ISK (kr)</option>
                    <option value='JMD'>JMD (J$)</option>
                    <option value='JOD'>JOD (JOD)</option>
                    <option value='JPY'>JPY (¥)</option>
                    <option value='KES'>KES (KSh)</option>
                    <option value='KGS'>KGS (KGS)</option>
                    <option value='KHR'>KHR (៛)</option>
                    <option value='KMF'>KMF (CF)</option>
                    <option value='KRW'>KRW (₩)</option>
                    <option value='KWD'>KWD (KWD)</option>
                    <option value='KYD'>KYD (CI$)</option>
                    <option value='KZT'>KZT (₸)</option>
                    <option value='LAK'>LAK (₭)</option>
                    <option value='LBP'>LBP (ل.ل)</option>
                    <option value='LKR'>LKR (Rs. )</option>
                    <option value='LTL'>LTL (Lt )</option>
                    <option value='LYD'>LYD (LD)</option>
                    <option value='MAD'>MAD (MAD)</option>
                    <option value='MDL'>MDL (MDL)</option>
                    <option value='MGA'>MGA (Ar)</option>
                    <option value='MKD'>MKD (ден)</option>
                    <option value='MMK'>MMK (K)</option>
                    <option value='MNT'>MNT (₮)</option>
                    <option value='MOP'>MOP (MOP$)</option>
                    <option value='MUR'>MUR (₨)</option>
                    <option value='MVR'>MVR (MVR)</option>
                    <option value='MWK'>MWK (K)</option>
                    <option value='MXN'>MXN ($)</option>
                    <option value='MYR'>MYR (RM)</option>
                    <option value='MZN'>MZN (MT)</option>
                    <option value='NAD'>NAD ($)</option>
                    <option value='NGN'>NGN (₦)</option>
                    <option value='NIO'>NIO (C$)</option>
                    <option value='NOK'>NOK (kr)</option>
                    <option value='NPR'>NPR (Rs. )</option>
                    <option value='NZD'>NZD ($)</option>
                    <option value='OMR'>OMR (OMR)</option>
                    <option value='PAB'>PAB (B/. )</option>
                    <option value='PEN'>PEN (S/. )</option>
                    <option value='PGK'>PGK (K)</option>
                    <option value='PHP'>PHP (₱)</option>
                    <option value='PKR'>PKR (Rs)</option>
                    <option value='PLN'>PLN (PLN)</option>
                    <option value='PYG'>PYG (₲)</option>
                    <option value='QAR'>QAR (QR)</option>
                    <option value='RON'>RON (RON)</option>
                    <option value='RSD'>RSD (RSD)</option>
                    <option value='RUB'>RUB (₽)</option>
                    <option value='RWF'>RWF (FRw)</option>
                    <option value='SAR'>SAR (SR)</option>
                    <option value='SBD'>SBD (SI$)</option>
                    <option value='SCR'>SCR (SR)</option>
                    <option value='SEK'>SEK (kr)</option>
                    <option value='SGD'>SGD ($)</option>
                    <option value='SLL'>SLL (Le)</option>
                    <option value='SRD'>SRD ($)</option>
                    <option value='STD'>STD (Db)</option>
                    <option value='STN'>STN (nDb)</option>
                    <option value='SYP'>SYP (£S)</option>
                    <option value='SZL'>SZL (E)</option>
                    <option value='THB'>THB (฿)</option>
                    <option value='TJS'>TJS (TJS)</option>
                    <option value='TMT'>TMT (T)</option>
                    <option value='TND'>TND (DT)</option>
                    <option value='TOP'>TOP (T$)</option>
                    <option value='TRY'>TRY (TL)</option>
                    <option value='TTD'>TTD (TT$)</option>
                    <option value='TWD'>TWD (NT$)</option>
                    <option value='TZS'>TZS (TZS)</option>
                    <option value='UAH'>UAH (₴)</option>
                    <option value='UGX'>UGX (USh)</option>
                    <option value='USD'>USD ($)</option>
                    <option value='UYU'>UYU ($)</option>
                    <option value='UZS'>UZS (UZS)</option>
                    <option value='VEF'>VEF (Bs)</option>
                    <option value='VND'>VND (₫)</option>
                    <option value='VUV'>VUV (Vt)</option>
                    <option value='WST'>WST (WS$)</option>
                    <option value='XAF'>XAF (CFA)</option>
                    <option value='XCD'>XCD (EC$)</option>
                    <option value='XOF'>XOF (CFA)</option>
                    <option value='XPF'>XPF (F)</option>
                    <option value='YER'>YER (YER)</option>
                    <option value='ZAR'>ZAR (R)</option>
                    <option value='ZMW'>ZMW (ZMW)</option>
                    <option value='ZWL'>ZWL (Z$)</option>
                  </select>
                </div>
                <span>Your time zone</span>
                <div>
                  <select
                    value={userTimezone}
                    className='modernized'
                    name='userTimezone'
                    id='user_time_zone'
                    onChange={(e) => {
                      setUserTimezone(e.target.value);
                    }}
                  >
                    <option value='International Date Line West'>
                      (GMT-12:00) International Date Line West
                    </option>
                    <option value='American Samoa'>
                      (GMT-11:00) American Samoa
                    </option>
                    <option value='Midway Island'>
                      (GMT-11:00) Midway Island
                    </option>
                    <option value='Hawaii'>(GMT-10:00) Hawaii</option>
                    <option value='Alaska'>(GMT-09:00) Alaska</option>
                    <option value='Pacific Time (US &amp; Canada)'>
                      (GMT-08:00) Pacific Time (US &amp; Canada)
                    </option>
                    <option value='Tijuana'>(GMT-08:00) Tijuana</option>
                    <option value='Arizona'>(GMT-07:00) Arizona</option>
                    <option value='Chihuahua'>(GMT-07:00) Chihuahua</option>
                    <option value='Mazatlan'>(GMT-07:00) Mazatlan</option>
                    <option value='Mountain Time (US &amp; Canada)'>
                      (GMT-07:00) Mountain Time (US &amp; Canada)
                    </option>
                    <option value='Central America'>
                      (GMT-06:00) Central America
                    </option>
                    <option value='Central Time (US &amp; Canada)'>
                      (GMT-06:00) Central Time (US &amp; Canada)
                    </option>
                    <option value='Guadalajara'>(GMT-06:00) Guadalajara</option>
                    <option value='Mexico City'>(GMT-06:00) Mexico City</option>
                    <option value='Monterrey'>(GMT-06:00) Monterrey</option>
                    <option value='Saskatchewan'>
                      (GMT-06:00) Saskatchewan
                    </option>
                    <option value='Bogota'>(GMT-05:00) Bogota</option>
                    <option value='Eastern Time (US &amp; Canada)'>
                      (GMT-05:00) Eastern Time (US &amp; Canada)
                    </option>
                    <option value='Indiana (East)'>
                      (GMT-05:00) Indiana (East)
                    </option>
                    <option value='Lima'>(GMT-05:00) Lima</option>
                    <option value='Quito'>(GMT-05:00) Quito</option>
                    <option value='Atlantic Time (Canada)'>
                      (GMT-04:00) Atlantic Time (Canada)
                    </option>
                    <option value='Caracas'>(GMT-04:00) Caracas</option>
                    <option value='Georgetown'>(GMT-04:00) Georgetown</option>
                    <option value='La Paz'>(GMT-04:00) La Paz</option>
                    <option value='Puerto Rico'>(GMT-04:00) Puerto Rico</option>
                    <option value='Santiago'>(GMT-04:00) Santiago</option>
                    <option value='Newfoundland'>
                      (GMT-03:30) Newfoundland
                    </option>
                    <option value='Brasilia'>(GMT-03:00) Brasilia</option>
                    <option value='Buenos Aires'>
                      (GMT-03:00) Buenos Aires
                    </option>
                    <option value='Greenland'>(GMT-03:00) Greenland</option>
                    <option value='Montevideo'>(GMT-03:00) Montevideo</option>
                    <option value='Mid-Atlantic'>
                      (GMT-02:00) Mid-Atlantic
                    </option>
                    <option value='Azores'>(GMT-01:00) Azores</option>
                    <option value='Cape Verde Is.'>
                      (GMT-01:00) Cape Verde Is.
                    </option>
                    <option value='Edinburgh'>(GMT+00:00) Edinburgh</option>
                    <option value='Lisbon'>(GMT+00:00) Lisbon</option>
                    <option value='London'>(GMT+00:00) London</option>
                    <option value='Monrovia'>(GMT+00:00) Monrovia</option>
                    <option value='UTC'>(GMT+00:00) UTC</option>
                    <option value='Amsterdam'>(GMT+01:00) Amsterdam</option>
                    <option value='Belgrade'>(GMT+01:00) Belgrade</option>
                    <option value='Berlin'>(GMT+01:00) Berlin</option>
                    <option value='Bern'>(GMT+01:00) Bern</option>
                    <option value='Bratislava'>(GMT+01:00) Bratislava</option>
                    <option value='Brussels'>(GMT+01:00) Brussels</option>
                    <option value='Budapest'>(GMT+01:00) Budapest</option>
                    <option value='Casablanca'>(GMT+01:00) Casablanca</option>
                    <option value='Copenhagen'>(GMT+01:00) Copenhagen</option>
                    <option value='Dublin'>(GMT+01:00) Dublin</option>
                    <option value='Ljubljana'>(GMT+01:00) Ljubljana</option>
                    <option value='Madrid'>(GMT+01:00) Madrid</option>
                    <option value='Paris'>(GMT+01:00) Paris</option>
                    <option value='Prague'>(GMT+01:00) Prague</option>
                    <option value='Rome'>(GMT+01:00) Rome</option>
                    <option value='Sarajevo'>(GMT+01:00) Sarajevo</option>
                    <option value='Skopje'>(GMT+01:00) Skopje</option>
                    <option value='Stockholm'>(GMT+01:00) Stockholm</option>
                    <option value='Vienna'>(GMT+01:00) Vienna</option>
                    <option value='Warsaw'>(GMT+01:00) Warsaw</option>
                    <option value='West Central Africa'>
                      (GMT+01:00) West Central Africa
                    </option>
                    <option value='Zagreb'>(GMT+01:00) Zagreb</option>
                    <option value='Zurich'>(GMT+01:00) Zurich</option>
                    <option value='Athens'>(GMT+02:00) Athens</option>
                    <option value='Bucharest'>(GMT+02:00) Bucharest</option>
                    <option value='Cairo'>(GMT+02:00) Cairo</option>
                    <option value='Harare'>(GMT+02:00) Harare</option>
                    <option value='Helsinki'>(GMT+02:00) Helsinki</option>
                    <option value='Jerusalem'>(GMT+02:00) Jerusalem</option>
                    <option value='Kaliningrad'>(GMT+02:00) Kaliningrad</option>
                    <option value='Kyiv'>(GMT+02:00) Kyiv</option>
                    <option value='Pretoria'>(GMT+02:00) Pretoria</option>
                    <option value='Riga'>(GMT+02:00) Riga</option>
                    <option value='Sofia'>(GMT+02:00) Sofia</option>
                    <option value='Tallinn'>(GMT+02:00) Tallinn</option>
                    <option value='Vilnius'>(GMT+02:00) Vilnius</option>
                    <option value='Baghdad'>(GMT+03:00) Baghdad</option>
                    <option value='Istanbul'>(GMT+03:00) Istanbul</option>
                    <option value='Kuwait'>(GMT+03:00) Kuwait</option>
                    <option value='Minsk'>(GMT+03:00) Minsk</option>
                    <option value='Moscow'>(GMT+03:00) Moscow</option>
                    <option value='Nairobi'>(GMT+03:00) Nairobi</option>
                    <option value='Riyadh'>(GMT+03:00) Riyadh</option>
                    <option value='St. Petersburg'>
                      (GMT+03:00) St. Petersburg
                    </option>
                    <option value='Volgograd'>(GMT+03:00) Volgograd</option>
                    <option value='Tehran'>(GMT+03:30) Tehran</option>
                    <option value='Abu Dhabi'>(GMT+04:00) Abu Dhabi</option>
                    <option value='Baku'>(GMT+04:00) Baku</option>
                    <option value='Muscat'>(GMT+04:00) Muscat</option>
                    <option value='Samara'>(GMT+04:00) Samara</option>
                    <option value='Tbilisi'>(GMT+04:00) Tbilisi</option>
                    <option value='Yerevan'>(GMT+04:00) Yerevan</option>
                    <option value='Kabul'>(GMT+04:30) Kabul</option>
                    <option value='Ekaterinburg'>
                      (GMT+05:00) Ekaterinburg
                    </option>
                    <option value='Islamabad'>(GMT+05:00) Islamabad</option>
                    <option value='Karachi'>(GMT+05:00) Karachi</option>
                    <option value='Tashkent'>(GMT+05:00) Tashkent</option>
                    <option value='Chennai'>(GMT+05:30) Chennai</option>
                    <option value='Kolkata'>(GMT+05:30) Kolkata</option>
                    <option value='Mumbai'>(GMT+05:30) Mumbai</option>
                    <option value='New Delhi'>(GMT+05:30) New Delhi</option>
                    <option value='Sri Jayawardenepura'>
                      (GMT+05:30) Sri Jayawardenepura
                    </option>
                    <option value='Kathmandu'>(GMT+05:45) Kathmandu</option>
                    <option value='Almaty'>(GMT+06:00) Almaty</option>
                    <option value='Astana'>(GMT+06:00) Astana</option>
                    <option value='Dhaka'>(GMT+06:00) Dhaka</option>
                    <option value='Urumqi'>(GMT+06:00) Urumqi</option>
                    <option value='Rangoon'>(GMT+06:30) Rangoon</option>
                    <option value='Bangkok'>(GMT+07:00) Bangkok</option>
                    <option value='Hanoi'>(GMT+07:00) Hanoi</option>
                    <option value='Jakarta'>(GMT+07:00) Jakarta</option>
                    <option value='Krasnoyarsk'>(GMT+07:00) Krasnoyarsk</option>
                    <option value='Novosibirsk'>(GMT+07:00) Novosibirsk</option>
                    <option value='Beijing'>(GMT+08:00) Beijing</option>
                    <option value='Chongqing'>(GMT+08:00) Chongqing</option>
                    <option value='Hong Kong'>(GMT+08:00) Hong Kong</option>
                    <option value='Irkutsk'>(GMT+08:00) Irkutsk</option>
                    <option value='Kuala Lumpur'>
                      (GMT+08:00) Kuala Lumpur
                    </option>
                    <option value='Perth'>(GMT+08:00) Perth</option>
                    <option value='Singapore'>(GMT+08:00) Singapore</option>
                    <option value='Taipei'>(GMT+08:00) Taipei</option>
                    <option value='Ulaanbaatar'>(GMT+08:00) Ulaanbaatar</option>
                    <option value='Osaka'>(GMT+09:00) Osaka</option>
                    <option value='Sapporo'>(GMT+09:00) Sapporo</option>
                    <option value='Seoul'>(GMT+09:00) Seoul</option>
                    <option value='Tokyo'>(GMT+09:00) Tokyo</option>
                    <option value='Yakutsk'>(GMT+09:00) Yakutsk</option>
                    <option value='Adelaide'>(GMT+09:30) Adelaide</option>
                    <option value='Darwin'>(GMT+09:30) Darwin</option>
                    <option value='Brisbane'>(GMT+10:00) Brisbane</option>
                    <option value='Canberra'>(GMT+10:00) Canberra</option>
                    <option value='Guam'>(GMT+10:00) Guam</option>
                    <option value='Hobart'>(GMT+10:00) Hobart</option>
                    <option value='Melbourne'>(GMT+10:00) Melbourne</option>
                    <option value='Port Moresby'>
                      (GMT+10:00) Port Moresby
                    </option>
                    <option value='Sydney'>(GMT+10:00) Sydney</option>
                    <option value='Vladivostok'>(GMT+10:00) Vladivostok</option>
                    <option value='Magadan'>(GMT+11:00) Magadan</option>
                    <option value='New Caledonia'>
                      (GMT+11:00) New Caledonia
                    </option>
                    <option value='Solomon Is.'>(GMT+11:00) Solomon Is.</option>
                    <option value='Srednekolymsk'>
                      (GMT+11:00) Srednekolymsk
                    </option>
                    <option value='Auckland'>(GMT+12:00) Auckland</option>
                    <option value='Fiji'>(GMT+12:00) Fiji</option>
                    <option value='Kamchatka'>(GMT+12:00) Kamchatka</option>
                    <option value='Marshall Is.'>
                      (GMT+12:00) Marshall Is.
                    </option>
                    <option value='Wellington'>(GMT+12:00) Wellington</option>
                    <option value='Chatham Is.'>(GMT+12:45) Chatham Is.</option>
                    <option value="Nuku'alofa">
                      (GMT+13:00) Nuku`&apos;`alofa
                    </option>
                    <option value='Samoa'>(GMT+13:00) Samoa</option>
                    <option value='Tokelau Is.'>(GMT+13:00) Tokelau Is.</option>
                  </select>
                </div>
                <span>Language</span>
                <div>
                  <select
                    value={userLanguage}
                    className='modernized'
                    name='userLanguage'
                    id='user_locale'
                    onChange={(e) => {
                      setUserLanguage(e.target.value);
                    }}
                  >
                    <option value='en'>English</option>
                    <option value='de'>Deutsch</option>
                    <option value='es'>Español</option>
                    <option value='fr'>Français</option>
                    <option value='id'>Bahasa Indonesia</option>
                    <option value='it'>Italiano</option>
                    <option value='ja'>日本語</option>
                    <option value='nl'>Nederlands</option>
                    <option value='pt-BR'>Português (Brasil)</option>
                    <option value='pt-PT'>Português (Portugal)</option>
                    <option value='sv'>Svenska</option>
                    <option value='th'>ภาษาไทย</option>
                    <option value='emoji'>😀</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type='submit'
          name='commit'
          className='btn btn-lg btn-orange'
          value='Save'
          style={{ marginLeft: '80%' }}
        />
      </form>
    </div>
  );
};

Profile.propTypes = {
  updateUserProfile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { updateUserProfile })(Profile);
