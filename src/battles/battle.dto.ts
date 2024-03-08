import { IsNotEmpty, IsUUID } from 'class-validator';

export class BattleDto {
  @IsNotEmpty()
  @IsUUID()
  monseterOneCode: string;

  @IsNotEmpty()
  @IsUUID()
  monseterTwoCode: string;
}
