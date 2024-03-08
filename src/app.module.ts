import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BattlesModule } from './battles/battles.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [BattlesModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
