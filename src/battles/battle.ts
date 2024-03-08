import { Logger } from '@nestjs/common';
import { Monster } from './monster';
import { v4 as uuidv4 } from 'uuid';

export class Battle {
  private readonly logger = new Logger(Battle.name);

  private id: string;
  monsterA!: Monster;
  monsterB!: Monster;
  winner!: Monster;

  constructor() {
    this.id = uuidv4();
  }

  public getId(): string {
    return this.id;
  }

  public async fight(monsterA: Monster, monsterB: Monster) {
    this.logger.debug('fight...');
    let monsterWinner: Monster | null = null;

    const participants: Monster[] = this.defineOrder(monsterA, monsterB);
    const firstMonster: Monster = participants[0];
    const secondMonster: Monster = participants[1];

    while (monsterWinner == null) {
      this.logger.debug(`${firstMonster.name}'s turn`);

      monsterWinner = this.attack(firstMonster, secondMonster);
      if (monsterWinner) {
        break;
      }

      this.logger.debug(`${secondMonster.name}'s turn`);

      monsterWinner = this.attack(secondMonster, firstMonster);
      this.logger.debug(`---------------------------------`);
      if (monsterWinner) {
        break;
      }
    }

    this.winner = monsterWinner;

    return monsterWinner;
  }

  public defineOrder(monsterA: Monster, monsterB: Monster): Monster[] {
    if (monsterA.speed > monsterB.speed) {
      return [monsterA, monsterB];
    }

    if (monsterA.speed < monsterB.speed) {
      return [monsterB, monsterA];
    }

    if (monsterA.attack > monsterB.attack) {
      return [monsterA, monsterB];
    }

    return [monsterB, monsterA];
  }

  private attack(attacker: Monster, defender: Monster): Monster | null {
    defender.receiveAttack(attacker.attack);

    this.logger.debug(
      `${attacker.name}[${attacker.hp}] hits: ${defender.name} with ${attacker.attack} points`,
    );
    this.logger.debug(
      `${defender.name}[${defender.hp}] blocks: ${attacker.name} attack with ${defender.defense} points`,
    );
    this.logger.debug(`${defender.name}'s HP: ${defender.hp}`);

    if (defender.hp <= 0) {
      this.logger.debug(`${attacker.name}' wins!`);
      return attacker;
    }
    return null;
  }
}
