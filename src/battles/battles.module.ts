import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { battlesController } from './battles.controller';
import { BattlesService } from './battles.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MONSTERS_MS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'monsters_ms_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'BATTLE_HISTORY_MS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'portfolio-battles-ms',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'portfolio-battles-ms-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [battlesController],
  providers: [BattlesService],
})
export class BattlesModule {}
