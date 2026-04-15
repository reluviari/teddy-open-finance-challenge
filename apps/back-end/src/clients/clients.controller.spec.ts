import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

describe('ClientsController', () => {
  let controller: ClientsController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDashboardStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [{ provide: ClientsService, useValue: mockService }],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    jest.clearAllMocks();
  });

  it('should delegate create to service', async () => {
    const inputDto = { name: 'John', email: 'j@t.com', salary: 5000, companyValue: 100000 };
    const expectedResponse = { id: 'uuid-1', ...inputDto, viewCount: 0, createdAt: new Date(), updatedAt: new Date() };
    mockService.create.mockResolvedValue(expectedResponse);

    const actual = await controller.create(inputDto);

    expect(actual).toEqual(expectedResponse);
    expect(mockService.create).toHaveBeenCalledWith(inputDto);
  });

  it('should delegate findAll to service', async () => {
    const expectedResponse = { data: [], total: 0 };
    mockService.findAll.mockResolvedValue(expectedResponse);

    const actual = await controller.findAll();

    expect(actual).toEqual(expectedResponse);
  });

  it('should delegate findOne to service', async () => {
    const expectedResponse = { id: 'uuid-1', name: 'John', viewCount: 1 };
    mockService.findOne.mockResolvedValue(expectedResponse);

    const actual = await controller.findOne('uuid-1');

    expect(actual).toEqual(expectedResponse);
    expect(mockService.findOne).toHaveBeenCalledWith('uuid-1');
  });

  it('should delegate update to service', async () => {
    const inputDto = { name: 'Jane' };
    mockService.update.mockResolvedValue({ id: 'uuid-1', name: 'Jane' });

    const actual = await controller.update('uuid-1', inputDto);

    expect(actual.name).toBe('Jane');
    expect(mockService.update).toHaveBeenCalledWith('uuid-1', inputDto);
  });

  it('should delegate remove to service', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove('uuid-1');

    expect(mockService.remove).toHaveBeenCalledWith('uuid-1');
  });

  it('should delegate getDashboardStats to service', async () => {
    const expectedResponse = { totalClients: 5, totalCompanyValue: 500000, latestClients: [], chartData: [] };
    mockService.getDashboardStats.mockResolvedValue(expectedResponse);

    const actual = await controller.getDashboardStats();

    expect(actual).toEqual(expectedResponse);
  });
});
