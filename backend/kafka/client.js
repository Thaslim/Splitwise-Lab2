import KafkaRPC from './kafkarpc.js';

const rpc = new KafkaRPC();
// make request to kafka
export default function make_request(queue_name, msg_payload, callback) {
  rpc.makeRequest(queue_name, msg_payload, (err, response) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, response);
    }
  });
}
