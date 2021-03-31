import _ from 'lodash';
import { roundToTwo } from './calc';

const getIndividualGroupBalance = (arr) => {
  const uniqueOwedToMeGroups = _.groupBy(arr, function (group) {
    return group.memberID._id;
  });

  let groupMembersBalance = [];
  _.forEach(uniqueOwedToMeGroups, function (value) {
    let mem = _(value)
      .groupBy('groupID._id')
      .map((obj, key) => ({
        memberName: obj[0].memberID.userName,
        groupName: obj[0].groupID.groupName,
        amount: roundToTwo(_.sumBy(obj, 'amount')),
      }))
      .value();
    groupMembersBalance = [...groupMembersBalance, mem];
  });

  const memBalanceEachGroup = _.groupBy(
    groupMembersBalance.flat(1),
    function (group) {
      return group.memberName;
    }
  );
  return memBalanceEachGroup;
};

export default getIndividualGroupBalance;
