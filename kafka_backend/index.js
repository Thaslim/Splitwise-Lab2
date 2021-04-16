import connectDB from './config/db.js';
import conn from './kafka/connection.js';
import handle_activity from './services/groups/activity.js';
import handle_user from './services/users/profile.js';
import handle_comment from './services/groups/expense-comment.js';

// connect databse
connectDB();
const connection = new conn();
function handleTopicRequest(topic_name, fname) {
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();

  consumer.on('message', function (message) {
    const data = JSON.parse(message.value);

    fname(data.data, function (err, res) {
      let errMsg = '';
      if (err) {
        errMsg = err.message;
      }
      console.log('line 17...', err, res);
      const payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
            error: errMsg,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, (err) => {
        if (err) console.log(`Error sending data..${err}`);
      });
      return;
    });
  });
}
console.log('kafka-backend is running... ');
handleTopicRequest('groups', handle_activity);
handleTopicRequest('users', handle_user);
handleTopicRequest('groups', handle_comment);
