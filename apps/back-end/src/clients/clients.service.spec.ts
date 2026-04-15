import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

describe('ClientsService', () => {
  let service: ClientsService;

  const mockClient: Client = {
    id: 'uuid-1',
    name: 'John Doe',
    email: 'john@example.com',
    salary: 5000,
    companyValue: 100000,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: getRepositoryToken(Client), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const inputCreate = {
      name: 'John Doe',
      email: 'john@example.com',
      salary: 5000,
      companyValue: 100000,
    };

    it('should create and return a client', async () => {
      mockRepository.create.mockReturnValue(mockClient);
      mockRepository.save.mockResolvedValue(mockClient);

      const actual = await service.create(inputCreate);

      expect(actual.id).toBe(mockClient.id);
      expect(actual.name).toBe(inputCreate.name);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of clients with total', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockClient], 1]);

      const actual = await service.findAll();

      expect(actual.data).toHaveLength(1);
      expect(actual.total).toBe(1);
      expect(actual.data[0].id).toBe(mockClient.id);
    });

    it('should return empty list when no clients exist', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const actual = await service.findAll();

      expect(actual.data).toHaveLength(0);
      expect(actual.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a client and increment viewCount', async () => {
      const inputClient = { ...mockClient, viewCount: 0 };
      mockRepository.findOne.mockResolvedValue(inputClient);
      mockRepository.save.mockResolvedValue({ ...inputClient, viewCount: 1 });

      const actual = await service.findOne('uuid-1');

      expect(actual.viewCount).toBe(1);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const inputUpdate = { name: 'Jane Doe' };

    it('should update and return the client', async () => {
      const expectedClient = { ...mockClient, name: 'Jane Doe' };
      mockRepository.findOne.mockResolvedValue({ ...mockClient });
      mockRepository.save.mockResolvedValue(expectedClient);

      const actual = await service.update('uuid-1', inputUpdate);

      expect(actual.name).toBe('Jane Doe');
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', inputUpdate)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete the client', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.softRemove.mockResolvedValue(mockClient);

      await service.remove('uuid-1');

      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockClient);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
