import { Monster } from './monster';
import { v4 as uuidv4 } from 'uuid';

export class Battle {
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
    let monsterWinner: Monster | null = null;

    const participants: Monster[] = this.defineOrder(monsterA, monsterB);
    const firstMonster: Monster = participants[0];
    const secondMonster: Monster = participants[1];

    while (monsterWinner == null) {
      monsterWinner = this.attack(firstMonster, secondMonster);
      if (monsterWinner) {
        break;
      }

      monsterWinner = this.attack(secondMonster, firstMonster);
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
    if (defender.hp <= 0) {
      return attacker;
    }
    return null;
  }
}
