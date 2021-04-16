import User from '../../models/User.js';

const res = {};

const handle_user = (myData, callback) => {
  const action = myData.action;
  if (action === 'updateProfile') {
    return updateProfileInfo(myData, callback);
  }
};

const updateProfileInfo = async (myData, callback) => {
  try {
    const profile = await User.findById(myData.userID);

    const userFields = {};
    if (myData.userName && profile.userName !== myData.userName) {
      userFields.userName = myData.userName;
    }
    if (myData.userEmail && profile.userEmail !== myData.userEmail) {
      const emailExists = await User.findOne({ userEmail: myData.userEmail });

      if (emailExists) {
        console.log('here');
        res.message = `${myData.userEmail} already belongs to another account.`;
        return callback(res, null);
      }

      userFields.userEmail = myData.userEmail;
    }

    if (myData.userCurrency && profile.userCurrency !== myData.userCurrency) {
      userFields.userCurrency = myData.userCurrency;
    }

    if (myData.userTimezone && profile.userTimezone !== myData.userTimezone) {
      userFields.userTimezone = myData.userTimezone;
    }

    if (myData.userLanguage && profile.userLanguage !== myData.userLanguage) {
      userFields.userLanguage = myData.userLanguage;
    }

    if (myData.userValidPhone && profile.userPhone !== myData.userValidPhone) {
      userFields.userPhone = myData.userValidPhone;
    }

    if (myData.filepath && profile.userPicture !== myData.filepath) {
      userFields.userPicture = myData.filepath;
    }

    if (profile) {
      await User.findByIdAndUpdate(myData.userID, {
        $set: userFields,
      });
      res.status = 200;
      res.message = 'Profile Updated';
      return callback(null, res);
    }
  } catch (error) {
    res.message = 'Server Error';
    return callback(res, null);
  }
};

export default handle_user;
