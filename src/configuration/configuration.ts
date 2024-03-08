import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    app: {
      port: process.env.PORT,
    },
    amqp: {
      amqpServer: process.env.AMQP_URL,
      battlesQueueName: process.env.BATTLES_MS_QUEUE_NAME,
      monstersQueueName: process.env.MONSTERS_MS_QUEUE_NAME,
    },
    kafka: {
      kafkaBroker: process.env.KAFKA_BROKER,
      kafkaClientId: process.env.KAFKA_CLIENT_ID,
      kafkaConsumerId: process.env.KAFKA_CONSUMER_ID,
    },
  };
});
