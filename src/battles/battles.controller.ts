import {
  Controller,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BattlesService } from './battles.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { BattleDto } from './battle.dto';
import { CustomRpcExceptionFilter } from '../common/filters/custom-rpc-exception.filter';

@Controller('battles')
export class battlesController {
  private readonly logger = new Logger(battlesController.name);

  constructor(private readonly battlesService: BattlesService) {}

  @MessagePattern('start-battle')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new RpcException(errors);
      },
    }),
  )
  @UseFilters(new CustomRpcExceptionFilter())
  startBattle(@Payload() payload: BattleDto) {
    this.logger.debug('startBattle...');
    return this.battlesService.startBattle(payload);
  }
}
