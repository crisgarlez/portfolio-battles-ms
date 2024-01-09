export class Monster {
  code: string;
  name: string;
  attack: number;
  defense: number;
  hp: number;
  speed: number;

  public receiveAttack(enemyAttackLevel: number) {
    let damage = enemyAttackLevel - this.defense;

    if (enemyAttackLevel <= this.defense) {
      damage = 1;
    }

    this.hp = this.hp - damage;
  }
}
