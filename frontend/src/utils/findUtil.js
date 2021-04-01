/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
export const findInArray = (arrObj, email) => {
  const found = arrObj.find((element) => element.memberEmail === email);
  return found;
};

export const findbyID = (arrObj, id) => {
  const found = arrObj.filter((ele) => String(ele._id) === String(id));
  return found;
};

export const findbyName = (arrObj, name) => {
  const found = arrObj.filter((ele) => ele.groupName === name);
  return found;
};

export const sortArray = (arrObj) => {
  const sortedArrObj = arrObj.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return sortedArrObj;
};

export const getMonthDate = (date) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthNames[date];
};

export const groupbyEmail = (arrObj) => {
  const individualGroupMembers = Object.values(
    arrObj.reduce((result, { name, bal, pic, email }) => {
      // Create new group
      if (!result[email]) result[email] = { email, details: [] };
      // Append to group
      result[email].details.push({
        name,
        bal,
        pic,
      });
      return result;
    }, {})
  );

  return individualGroupMembers;
};
