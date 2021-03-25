import express from 'express';
export const router = express.Router();
import auth from '../../../middleware/auth.js';
import { splitwisedb } from '../../../config/database.js';

const findInArray = (arrObj, id) => {
  const found = arrObj.find((element) => element.idExpense === id);
  return found;
};
// @route POST api/settle
// @desc Update profile information
// @access Private
router.post('/', auth, async (req, res) => {
  const { settleWithEmail: settleWithEmail } = req.body;
  const settledByEmail = req.user.key;
  try {
    //get related balance
    const getRelatedBalances = await splitwisedb.getRelatedBalances(
      settledByEmail,
      settleWithEmail
    );
    const actionByName = await splitwisedb.getUserName(req.user.id);
    const actionWithName = await splitwisedb.getUserNamebyEmail(
      settleWithEmail
    );
    console.log(actionWithName[0].userName);
    // console.log(getRelatedBalances);
    const stringifyGetRelatedBalances = JSON.stringify(getRelatedBalances);
    const jsonGetRelatedBalances = JSON.parse(stringifyGetRelatedBalances);
    //update related balance

    const unresolvedPromises = jsonGetRelatedBalances.map(async (val) => {
      const groupName = await splitwisedb.getGroupName(val.egID);

      const activity = await splitwisedb.addActivity(
        `settled up in group`,
        val.egID,
        groupName[0].groupName,
        actionByName[0].userName,
        settledByEmail,
        actionWithName[0].userName,
        settleWithEmail
      );
      return await splitwisedb.updateRelatedBalances(val.idSplitExpense);
    });

    const updatedRelatedBalance = await Promise.all(unresolvedPromises);

    //get paid by balance
    const getpaidbyBalance = await splitwisedb.getPaidByBalances(
      settleWithEmail
    );

    const stringifyGetpaidbyBalance = JSON.stringify(getpaidbyBalance);
    const jsonGetpaidbyBalance = JSON.parse(stringifyGetpaidbyBalance);

    const unresPromise = jsonGetpaidbyBalance.map(async (val) => {
      const findExp = findInArray(jsonGetRelatedBalances, val.idExpense);
      if (findExp) {
        let settled;
        if (-0.5 > val.balance + findExp.balance < 0.5) {
          settled = 1;
        } else {
          settled = 0;
        }

        return await splitwisedb.updatePaidByBalances(
          val.idSplitExpense,
          val.balance + findExp.balance,
          settled
        );
      }
    });
    const updatePaidByBalances = await Promise.all(unresPromise);

    //get additional settling
    const balancedOwedToMe = await splitwisedb.getRelatedBalances(
      settleWithEmail,
      settledByEmail
    );
    // console.log(balancedOwedToMe);
    if (balancedOwedToMe.length > 0) {
      const OwedToMeBal = JSON.stringify(balancedOwedToMe);
      const jsonOwedToMeBal = JSON.parse(OwedToMeBal);

      const unres = jsonOwedToMeBal.map(async (val) => {
        return await splitwisedb.updateRelatedBalances(val.idSplitExpense);
      });
      const owedToMeBalanceUpdated = await Promise.all(unres);
      //get paid by balance
      const paidByMe = await splitwisedb.getPaidByBalances(settledByEmail);
      const balancePaidByMe = JSON.stringify(paidByMe);
      const jsonBalancePaidByMe = JSON.parse(balancePaidByMe);
      // console.log(paidByMe);
      const unres2 = jsonBalancePaidByMe.map(async (val) => {
        const findExp = findInArray(jsonOwedToMeBal, val.idExpense);
        if (findExp) {
          let settled;
          if (-0.5 > val.balance + findExp.balance < 0.5) {
            settled = 1;
          } else {
            settled = 0;
          }
          return await splitwisedb.updatePaidByBalances(
            val.idSplitExpense,
            val.balance + findExp.balance,
            settled
          );
        }
      });
      const OwedToMePaidByUpdated = await Promise.all(unres2);
    }

    if (
      (updatePaidByBalances && updatedRelatedBalance) ||
      (owedToMeBalanceUpdated && OwedToMePaidByUpdated)
    ) {
      res.status(200).json({
        message: 'Settled up successfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
