import React, { useState } from 'react';
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
import { settleExpense } from '../../actions/dashboard';

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

const SettleUp = ({
  settleUp,
  setSettleUp,
  currency,
  oweNames,
  settleExpense,
}) => {
  const [settleWithEmail, setSettleWithEmail] = useState('');

  const onSettle = async (e) => {
    e.preventDefault();
    settleExpense(settleWithEmail);
    setTimeout(() => {
      setSettleUp(false);
    }, 1000);
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
        <DialogTitle style={{ background: '#1cc29f' }} id='form-dialog-title'>
          Settle Up
        </DialogTitle>

        {!oweNames.length && (
          <DialogContent className={classes.resize}>
            Nothing to Settle{' '}
          </DialogContent>
        )}

        {oweNames.length && (
          <>
            <DialogContentText>Select a friend to Settle.</DialogContentText>
            <form onSubmit={(e) => onSettle(e)}>
              <DialogContent>
                <FormControl required className={classes.root}>
                  <InputLabel>settle to</InputLabel>
                  <Select
                    id='settle-to-select'
                    value={settleWithEmail}
                    onChange={(e) => setSettleWithEmail(e.target.value)}
                    className={classes.selectEmpty}
                    name='settleWithEmail'
                  >
                    {oweNames &&
                      oweNames.map((val) => (
                        <MenuItem key={val.email} value={val.email}>
                          {val.name} (Amount: {currency}
                          {-val.bal})
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
                <Button type='submit' background='#1cc29f' color='secondary'>
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
  currency: PropTypes.string.isRequired,
  settleExpense: PropTypes.func.isRequired,
};
export default connect(null, { settleExpense })(SettleUp);
