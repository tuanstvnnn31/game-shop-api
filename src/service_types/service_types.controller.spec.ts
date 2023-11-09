import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypesController } from './service_types.controller';
import { ServiceTypesService } from './service_types.service';

describe('ServiceTypesController', () => {
  let controller: ServiceTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceTypesController],
      providers: [ServiceTypesService],
    }).compile();

    controller = module.get<ServiceTypesController>(ServiceTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
