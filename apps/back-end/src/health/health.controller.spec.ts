import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('check', () => {
    it('should return ok status with timestamp', () => {
      const actual = controller.check();

      expect(actual.status).toBe('ok');
      expect(actual.timestamp).toBeDefined();
      expect(new Date(actual.timestamp).getTime()).not.toBeNaN();
    });
  });
});
