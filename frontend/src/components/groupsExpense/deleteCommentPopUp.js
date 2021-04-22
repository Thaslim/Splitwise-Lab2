import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { deleteComment } from '../../actions/comment';
import PropTypes from 'prop-types';

const DeleteCommentPopUp = ({
  deleteCommentPopUp,
  setdeleteCommentPopUp,
  commentID,
  id,
  deleteComment,
}) => {
  const handleOK = (e) => {
    e.preventDefault();
    deleteComment({ expenseID: id, commentID });
    setdeleteCommentPopUp(false);
  };

  return (
    <div>
      <Dialog
        open={deleteCommentPopUp}
        onClose={() => setdeleteCommentPopUp(false)}
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this comment?.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setdeleteCommentPopUp(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={(e) => handleOK(e)} color='primary' autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DeleteCommentPopUp.propTypes = {
  deleteCommentPopUp: PropTypes.bool.isRequired,
  setdeleteCommentPopUp: PropTypes.func.isRequired,
  commentID: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  deleteComment: PropTypes.func.isRequired,
};
export default connect(null, { deleteComment })(DeleteCommentPopUp);
