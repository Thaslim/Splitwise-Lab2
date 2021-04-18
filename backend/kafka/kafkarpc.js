import crypto from 'crypto';
import conn from './connection.js';

const TIMEOUT = 3000; // time to wait for response in ms

export default class KafkaRPC {
  constructor() {
    this.connection = new conn();
    this.requests = {}; // hash to store request in wait for response
    this.response_queue = false; // placeholder for the future queue
    this.producer = this.connection.getProducer();
  }
  makeRequest(topic_name, content, callback) {
    // generate a unique correlation id for this call
    const correlationId = crypto.randomBytes(16).toString('hex');

    // create a timeout for what should happen if we don't get a response
    const tId = setTimeout(
      (corr_id) => {
        // if this ever gets called we didn't get a response in a
        // timely fashion
        callback(new Error(`timeout ${corr_id}`));
        // delete the entry from hash
        delete this.requests[corr_id];
      },
      TIMEOUT,
      correlationId
    );

    // create a request entry to store in a hash
    const entry = {
      callback,
      timeout: tId, // the id for the timeout so we can clear it
    };

    // put the entry in the hash so we can match the response later
    this.requests[correlationId] = entry;

    // make sure we have a response topic
    this.setupResponseQueue(this.producer, topic_name, () => {
      // put the request on a topic
      const payloads = [
        {
          topic: topic_name,
          messages: JSON.stringify({
            correlationId,
            replyTo: 'response_topic',
            data: content,
          }),
          partition: 0,
        },
      ];

      this.producer.send(payloads, (err) => {
        if (err) console.log(err);
      });
    });
  }
  setupResponseQueue(producer, topic_name, next) {
    // don't mess around if we have a queue
    if (this.response_queue) return next();

    // subscribe to messages
    const consumer = this.connection.getConsumer('response_topic');

    consumer.on('message', (message) => {
      const data = JSON.parse(message.value);
      // get the correlationId
      const { correlationId } = data;
      // is it a response to a pending request
      if (correlationId in this.requests) {
        // retrieve the request entry
        const entry = this.requests[correlationId];
        // make sure we don't timeout by clearing it
        clearTimeout(entry.timeout);
        // delete the entry from hash
        delete this.requests[correlationId];
        if (data.error) {
          entry.callback(data.error, null);
        } else {
          // callback, no err
          entry.callback(null, data.data);
        }
      }
    });

    consumer.on('error', (err) => {
      console.log(err);
    });
    consumer.on('offsetOutOfRange', (err) => {
      console.log(err);
    });
    this.response_queue = true;
    console.log('returning next');
    return next();
  }
}
