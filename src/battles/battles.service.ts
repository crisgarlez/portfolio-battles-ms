import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Battle } from './battle';
import { Monster } from './monster';

@Injectable()
export class BattlesService {
  constructor(
    @Inject('MONSTERS_MS') private client: ClientProxy,
    @Inject('BATTLE_HISTORY_MS') private historyClient: ClientProxy,
  ) {}

  async startBattle(data) {
    console.log('data:', data);

    const { monseterOneCode, monseterTwoCode } = data;

    let monsterData$ = this.client.send<any>('find-monster-by-code', {
      id: monseterOneCode,
    });

    let monsterData = await lastValueFrom(monsterData$);

    console.log('MonsterA: ' + monsterData);

    const monsterA = new Monster();
    monsterA.code = monsterData.code;
    monsterA.name = monsterData.name;
    monsterA.attack = monsterData.attack;
    monsterA.defense = monsterData.defense;
    monsterA.hp = monsterData.hp;
    monsterA.speed = monsterData.speed;

    console.log('monsterA:', monsterA);

    monsterData$ = this.client.send<any>('find-monster-by-code', {
      id: monseterTwoCode,
    });

    monsterData = await lastValueFrom(monsterData$);

    console.log('MonsterB: ' + monsterData);

    const monsterB = new Monster();
    monsterB.code = monsterData.code;
    monsterB.name = monsterData.name;
    monsterB.attack = monsterData.attack;
    monsterB.defense = monsterData.defense;
    monsterB.hp = monsterData.hp;
    monsterB.speed = monsterData.speed;

    console.log('monsterB:', monsterB);

    const battle = new Battle();
    battle.monsterA = monsterA;
    battle.monsterB = monsterB;

    const winner: Monster = await battle.fight(monsterA, monsterB);

    const loser: Monster = winner.code == monsterA.code ? monsterB : monsterA;

    const history$ = this.historyClient.emit<any>('create-reccord-topic', {
      id: battle.getId(),
      battletime: new Date().getTime(),
      loserid: loser.code,
      losername: loser.name,
      winnerid: winner.code,
      winnername: winner.name,
      monstera: monsterA.code,
      monsterb: monsterB.code,
    });

    // const history = await lastValueFrom(history$);

    // console.log('history:', history);

    return { winner };
  }
}
