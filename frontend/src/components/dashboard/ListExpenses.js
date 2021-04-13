import React, { useState, useEffect } from 'react';
import receipt from './receipt.png';
import {
  postComments,
  getComments,
  deleteComment,
} from '../../actions/comment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { getMonthDate } from '../../utils/findUtil';

const ListExpenses = ({
  description,
  paidAmount,
  lentAmount,
  paidby,
  lent,
  date,
  month,
  currency,
  cls,
  id,
  year,
  postComments,
  getComments,
  deleteComment,
  user,
  comment: { comments, loading },
}) => {
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState([]);

  const handlePost = async (e, id, message) => {
    e.preventDefault();
    postComments({ expenseID: id, message });
    setMessage('');
  };

  const delComment = (commentID) => {
    deleteComment({ expenseID: id, commentID });
  };
  const handleClick = (id) => {
    const x = document.querySelector(`[data-listid="${id}"]`);
    if (x.style.display === 'none') {
      x.style.display = 'table';
      getComments(id);
    } else {
      x.style.display = 'none';
      setNotes([]);
    }
  };

  useEffect(() => {
    if (comments) setNotes(comments.comments);
  }, [comments]);
  return (
    <div data-testid='listexpense' className='list-group-item'>
      <div className='main-block'>
        <div
          className='date'
          style={{
            color: '#999',
            textTransform: 'uppercase',
            fontSize: '12px',
            height: '35px',
            width: '35px',
            float: 'left',
          }}
        >
          {month}
          <div
            className='number'
            style={{
              color: '#999',
              fontSize: '20px',
            }}
          >
            {date}
          </div>
        </div>
        <i
          className='fas fa-receipt'
          style={{
            fontSize: '25px',
            color: '#555555',
            marginTop: '5%',
            opacity: '0.6',
          }}
        />
        &nbsp;
        <span
          className='expense-desc'
          style={{ display: 'inline' }}
          onClick={() => {
            handleClick(id);
          }}
        >
          &nbsp; {description}
        </span>
      </div>
      <div
        className='cost'
        style={{
          padding: '11px 10px 0px 10px',
          overflow: 'hidden',
          float: 'left',
          width: '125px',
        }}
      >
        &nbsp;
        {paidby}
        <br />
        <span
          className='number'
          style={{ fontSize: '16px', color: '#000', fontWeight: 'bold' }}
        >
          &nbsp;
          {currency}
          {paidAmount}
        </span>
      </div>
      <div
        className='you'
        style={{
          padding: '11px 10px 0px 10px',
          overflow: 'hidden',
        }}
      >
        &nbsp;
        {lent}
        &nbsp;
        <span
          data-testid='amount'
          className={cls}
          style={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          {currency}
          {lentAmount}
        </span>
      </div>
      <table
        className='expense-comments'
        data-listid={id}
        style={{ display: 'none' }}
      >
        <tbody>
          <tr>
            <td colSpan='2'>
              <img
                style={{ width: '50px' }}
                src={receipt}
                className='category'
                alt='recipt logo'
              ></img>
              <h5>{description}</h5>
              <div className='cost'>
                {currency}
                {paidAmount}
              </div>
              <div className='creation_info'>
                Added by {paidby} on {month} {date}, {year}
              </div>
            </td>
          </tr>

          <tr className='blank_row'>
            <td colSpan='3'></td>
          </tr>
          <tr>
            <td className='right'>
              <div className='comments'>
                <h5
                  style={{
                    fontSize: '12px',
                    color: 'rgb(143, 138, 138)',
                  }}
                >
                  <i className='fas fa-comments'></i> NOTES AND COMMENTS
                </h5>
                <ul>
                  {notes &&
                    notes.map((comment) => {
                      const dt = moment(comment.date)
                        .local()
                        .format('YYYY-MM-DD');

                      const currentUser = comment.from === user.userName;

                      return (
                        <li key={comment._id}>
                          <div className='comment User'>
                            <div style={{ fontWeight: 'bold' }}>
                              {comment.from}
                              <span
                                style={{ display: 'inline' }}
                                className='timestamp'
                              >
                                {getMonthDate(moment(dt).month())}{' '}
                                {moment(dt).date()}
                              </span>

                              {currentUser && (
                                <i
                                  className='fas fa-times delete_comment'
                                  onClick={() =>
                                    delComment(String(comment._id))
                                  }
                                />
                              )}
                            </div>
                            {comment.message}
                          </div>
                        </li>
                      );
                    })}
                </ul>

                <div className='add_comment'>
                  <textarea
                    placeholder='Add a comment'
                    cols='35'
                    rows='2'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>

                  <button
                    type='submit'
                    className='btn btn-small btn-orange'
                    onClick={(e) => handlePost(e, id, message)}
                  >
                    Post
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ListExpenses.propTypes = {
  postComments: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  comment: state.comment,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  postComments,
  getComments,
  deleteComment,
})(ListExpenses);
