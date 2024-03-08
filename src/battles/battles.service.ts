import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Battle } from './battle';
import { Monster } from './monster';
import { BattleDto } from './battle.dto';

@Injectable()
export class BattlesService {
  private readonly logger = new Logger(BattlesService.name);

  constructor(
    @Inject('MONSTERS_MS') private client: ClientProxy,
    @Inject('BATTLE_HISTORY_MS') private historyClient: ClientProxy,
  ) {}

  async startBattle(data: BattleDto) {
    this.logger.debug('startBattle...');

    const { monseterOneCode, monseterTwoCode } = data;

    let monsterData$ = this.client.send<any>('find-monster-by-code', {
      code: monseterOneCode,
    });

    let monsterData = await lastValueFrom(monsterData$);

    const monsterA = new Monster();
    monsterA.code = monsterData.code;
    monsterA.name = monsterData.name;
    monsterA.attack = monsterData.attack;
    monsterA.defense = monsterData.defense;
    monsterA.hp = monsterData.hp;
    monsterA.speed = monsterData.speed;

    this.logger.debug('MonsterA:', JSON.stringify(monsterA));

    monsterData$ = this.client.send<any>('find-monster-by-code', {
      code: monseterTwoCode,
    });

    monsterData = await lastValueFrom(monsterData$);

    const monsterB = new Monster();
    monsterB.code = monsterData.code;
    monsterB.name = monsterData.name;
    monsterB.attack = monsterData.attack;
    monsterB.defense = monsterData.defense;
    monsterB.hp = monsterData.hp;
    monsterB.speed = monsterData.speed;

    this.logger.debug('MonsterB:', JSON.stringify(monsterB));

    const battle = new Battle();
    battle.monsterA = monsterA;
    battle.monsterB = monsterB;

    const winner: Monster = await battle.fight(monsterA, monsterB);

    this.logger.debug('winner:', JSON.stringify(winner));

    const loser: Monster = winner.code == monsterA.code ? monsterB : monsterA;

    this.historyClient.emit<any>('create-reccord-topic', {
      id: battle.getId(),
      battletime: new Date().getTime(),
      loserid: loser.code,
      losername: loser.name,
      winnerid: winner.code,
      winnername: winner.name,
      monstera: monsterA.code,
      monsterb: monsterB.code,
    });

    return { winner };
  }
}
