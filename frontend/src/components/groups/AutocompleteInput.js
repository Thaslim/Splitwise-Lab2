import React from 'react';
import { TextField, makeStyles } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import PropTypes from 'prop-types';
import profilePic from '../user/profile-pic.png';

const OPTIONS_LIMIT = 5;
const defaultFilterOptions = createFilterOptions();

const filterOptions = (options, state) => {
  return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

// eslint-disable-next-line object-curly-newline
const AutocompleteInput = ({
  idx,
  members,
  userList,
  vals,
  handleInputChange,
  onDelete,
  suggestionSelected,
}) => {
  const memName = `memberName-${idx}`;
  const memEmail = `memberEmail-${idx}`;

  const classes = useStyles();
  return (
    <>
      <div className='row'>
        <div className='col-sm groupMembers'>
          <img
            style={{ marginTop: '27%' }}
            src={vals.memberPicture || profilePic}
            alt='profilePic'
          />
        </div>
        <div className='col-sm' style={{ marginLeft: '-15%' }}>
          <Autocomplete
            filterOptions={filterOptions}
            freeSolo
            id={memName}
            disableClearable
            options={userList}
            onChange={(e, value) => suggestionSelected(e, value)}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                className={classes.root}
                label='Name'
                margin='normal'
                variant='outlined'
                name={memName}
                value={members[idx].memeberName}
                size='small'
                InputProps={{ ...params.InputProps, type: 'search' }}
                onChange={handleInputChange}
              />
            )}
          />
        </div>
        <div className='col-sm' style={{ marginLeft: '-5.5%' }}>
          <TextField
            className={classes.root}
            // eslint-disable-next-line react/jsx-props-no-spreading
            label='Email'
            margin='normal'
            variant='outlined'
            id={memEmail}
            name={memEmail}
            value={members[idx].memberEmail}
            size='small'
            type='email'
            onChange={handleInputChange}
          />
        </div>
        <div className='col-sm pt-4' style={{ marginLeft: '-2.5%' }}>
          <i
            onClick={() => onDelete(vals)}
            className='fas fa-times'
            aria-hidden='true'
          />
        </div>
      </div>
    </>
  );
};

AutocompleteInput.propTypes = {
  idx: PropTypes.number.isRequired,
  members: PropTypes.array.isRequired,
  userList: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  vals: PropTypes.object.isRequired,
  suggestionSelected: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AutocompleteInput;
