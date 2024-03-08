import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { battlesController } from './battles.controller';
import { BattlesService } from './battles.service';
import config from '../configuration/configuration';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'MONSTERS_MS',
          inject: [config.KEY],
          useFactory: (configService: ConfigType<typeof config>) => {
            const { amqpServer, monstersQueueName } = configService.amqp;

            return {
              name: 'MONSTERS_MS',
              transport: Transport.RMQ,
              options: {
                urls: [amqpServer],
                queue: monstersQueueName,
                queueOptions: {
                  durable: false,
                },
              },
            };
          },
        },
        {
          name: 'BATTLE_HISTORY_MS',
          inject: [config.KEY],
          useFactory: (configService: ConfigType<typeof config>) => {
            const { kafkaBroker, kafkaClientId, kafkaConsumerId } =
              configService.kafka;

            return {
              name: 'BATTLE_HISTORY_MS',
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: kafkaClientId,
                  brokers: [kafkaBroker],
                },
                consumer: {
                  groupId: kafkaConsumerId,
                },
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [battlesController],
  providers: [BattlesService],
})
export class BattlesModule {}
