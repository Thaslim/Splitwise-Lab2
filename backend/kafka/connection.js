import kafka from 'kafka-node';
import stime from '../config/currentTime.js';

class ConnectionProvider {
  constructor() {
    this.getConsumer = function (topic_name) {
      this.client = new kafka.KafkaClient('localhost:2181');
      this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
        { topic: topic_name, partition: 0 },
      ]);
      this.client.on('ready', () => {
        console.log('client ready!');
      });

      return this.kafkaConsumerConnection;
    };

    // Code will be executed when we start Producer
    this.getProducer = function () {
      if (!this.kafkaProducerConnection) {
        this.client = new kafka.KafkaClient('localhost:2181');
        const { HighLevelProducer } = kafka;
        this.kafkaProducerConnection = new HighLevelProducer(this.client);
        console.log('producer ready');
      }
      return this.kafkaProducerConnection;
    };
  }
}
export default ConnectionProvider;
