import { Test, TestingModule } from '@nestjs/testing';
import { BattlesService } from './battles.service';
import { ClientProxy } from '@nestjs/microservices';
import { Monster } from './monster';
import { of } from 'rxjs';

describe('BattlesService', () => {
  let service: BattlesService;
  let clientProxyMock: jest.Mocked<ClientProxy>;
  let historyClientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattlesService,
        {
          provide: 'MONSTERS_MS',
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: 'BATTLE_HISTORY_MS',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BattlesService>(BattlesService);
    clientProxyMock = module.get('MONSTERS_MS');
    historyClientProxyMock = module.get('BATTLE_HISTORY_MS');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start a battle', async () => {
    const monsterOneData: Partial<Monster> = {
      code: '001',
      name: 'Monster One',
      attack: 50,
      defense: 20,
      hp: 100,
      speed: 30,
      receiveAttack: jest.fn(),
    };

    const monsterTwoData: Partial<Monster> = {
      code: '002',
      name: 'Monster Two',
      attack: 40,
      defense: 30,
      hp: 120,
      speed: 25,
    };

    const expectedWinner = new Monster();
    expectedWinner.code = monsterTwoData.code;
    expectedWinner.name = monsterTwoData.name;
    expectedWinner.attack = monsterTwoData.attack;
    expectedWinner.defense = monsterTwoData.defense;
    expectedWinner.hp = 20;
    expectedWinner.speed = monsterTwoData.speed;

    clientProxyMock.send.mockImplementationOnce((pattern, data) => {
      return of(monsterOneData as Partial<Monster>);
    });

    clientProxyMock.send.mockImplementationOnce((pattern, data) => {
      return of(monsterTwoData as Partial<Monster>);
    });

    const result = await service.startBattle({
      monseterOneCode: monsterOneData.code,
      monseterTwoCode: monsterTwoData.code,
    });

    expect(clientProxyMock.send).toBeCalledTimes(2);
    expect(historyClientProxyMock.emit).toBeCalledTimes(1);
    expect(result.winner).toEqual(expectedWinner);
  });
});
