import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  FormControl,
  DialogContentText,
} from '@material-ui/core';
import { settleExpense } from '../../actions/group';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '30ch',
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(3),
  },

  resize: {
    fontSize: 30,
    color: 'green',
  },
}));
const findbyMemID = (arrObj, id) => {
  const found = arrObj.filter((ele) => String(ele.memberID) === String(id));
  return found;
};
const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
const SettleUp = ({
  settleUp,
  setSettleUp,
  currency,
  oweNames,
  getBackNames,
  settleExpense,
}) => {
  const [settleWithID, setsettleWithID] = useState('');
  const [consOweNames, setConsOweNames] = useState([]);
  useEffect(() => {
    const final = [];
    let getBackIDS;
    if (getBackNames.length) {
      getBackIDS = getBackNames.map((ele) => ele.memberID);
    }

    if (oweNames.length) {
      // eslint-disable-next-line array-callback-return
      oweNames.map((ele) => {
        const id = String(ele.memberID);
        if (getBackIDS && getBackIDS.includes(id)) {
          const getbackInfo = findbyMemID(getBackNames, id);
          if (roundToTwo(ele.amount - getbackInfo[0].amount) > 0) {
            final.push({
              memberID: ele.memberID,
              memberName: ele.memberName,
              amount: roundToTwo(ele.amount - getbackInfo[0].amount),
            });
          }
        } else {
          final.push({
            memberID: ele.memberID,
            memberName: ele.memberName,
            amount: ele.amount,
          });
        }
      });
    }
    setConsOweNames(final);
  }, [oweNames, getBackNames]);

  const onSettle = async (e) => {
    e.preventDefault();
    settleExpense(settleWithID);
    setTimeout(() => {
      setSettleUp(false);
    }, 300);
  };
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={settleUp}
        onClose={() => {
          setSettleUp(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle style={{ background: '#e0f2f1' }} id='form-dialog-title'>
          Settle Up
        </DialogTitle>

        {!oweNames.length ||
          (!consOweNames.length && (
            <DialogContent className={classes.resize}>
              Nothing to Settle
            </DialogContent>
          ))}

        {consOweNames.length && (
          <>
            <DialogContentText>
              <br /> &nbsp; Select a friend to Settle.
            </DialogContentText>
            <form onSubmit={(e) => onSettle(e)}>
              <DialogContent>
                <FormControl required className={classes.root}>
                  <InputLabel>settle to</InputLabel>
                  <Select
                    id='settle-to-select'
                    value={settleWithID}
                    onChange={(e) => setsettleWithID(e.target.value)}
                    className={classes.selectEmpty}
                    name='settleWithID'
                  >
                    {consOweNames &&
                      consOweNames.map((val) => (
                        <MenuItem key={val.memberID} value={val.memberID}>
                          {val.memberName} (Amount: {currency}
                          {val.amount})
                        </MenuItem>
                      ))}
                  </Select>

                  <FormHelperText>* Required</FormHelperText>
                </FormControl>
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => {
                    setSettleUp(false);
                  }}
                  color='primary'
                >
                  Cancel
                </Button>
                <Button type='submit' color='secondary'>
                  Settle
                </Button>
              </DialogActions>
            </form>
          </>
        )}
      </Dialog>
    </div>
  );
};

SettleUp.propTypes = {
  settleUp: PropTypes.bool.isRequired,
  setSettleUp: PropTypes.func.isRequired,
  oweNames: PropTypes.array.isRequired,
  getBackNames: PropTypes.array.isRequired,
  currency: PropTypes.string.isRequired,
  settleExpense: PropTypes.func.isRequired,
};
export default connect(null, { settleExpense })(SettleUp);
