import { Controller } from '@nestjs/common';
import { BattlesService } from './battles.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('battles')
export class battlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @MessagePattern('start-battle')
  startBattle(@Payload() payload: any, @Ctx() context: RmqContext) {
    return this.battlesService.startBattle(payload);
  }
}
