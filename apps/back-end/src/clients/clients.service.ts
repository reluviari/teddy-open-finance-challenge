import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import {
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
  ClientListResponseDto,
  DashboardResponseDto,
} from './dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 16;
const LATEST_CLIENTS_LIMIT = 10;

/** Handles all client business logic including CRUD, soft delete, and view counting. */
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /** Creates a new client. */
  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    const client = this.clientRepository.create(createClientDto);
    const saved = await this.clientRepository.save(client);
    return this.toResponse(saved);
  }

  /** Returns paginated active (non-deleted) clients. */
  async findAll(page?: number, limit?: number): Promise<ClientListResponseDto> {
    const take = limit && limit > 0 ? limit : DEFAULT_LIMIT;
    const skip = page && page > 1 ? (page - 1) * take : 0;

    const [data, total] = await this.clientRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    return {
      data: data.map((client) => this.toResponse(client)),
      total,
    };
  }

  /** Returns a single client by ID and increments its view counter. */
  async findOne(id: string): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    client.viewCount += 1;
    await this.clientRepository.save(client);

    return this.toResponse(client);
  }

  /** Updates a client by ID. Throws NotFoundException if not found. */
  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    Object.assign(client, updateClientDto);
    const saved = await this.clientRepository.save(client);
    return this.toResponse(saved);
  }

  /** Soft deletes a client by ID. Throws NotFoundException if not found. */
  async remove(id: string): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    await this.clientRepository.softRemove(client);
  }

  /** Returns dashboard aggregations using efficient SQL queries. */
  async getDashboardStats(): Promise<DashboardResponseDto> {
    const totals = await this.clientRepository
      .createQueryBuilder('c')
      .select('COUNT(*)', 'totalClients')
      .addSelect('COALESCE(SUM(c.companyValue), 0)', 'totalCompanyValue')
      .where('c.deletedAt IS NULL')
      .getRawOne();

    const latestRaw = await this.clientRepository.find({
      order: { createdAt: 'DESC' },
      take: LATEST_CLIENTS_LIMIT,
    });

    const chartRaw: { month: string; count: string }[] = await this.clientRepository
      .createQueryBuilder('c')
      .select("TO_CHAR(c.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('c.deletedAt IS NULL')
      .groupBy("TO_CHAR(c.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      totalClients: Number(totals.totalClients),
      totalCompanyValue: Number(totals.totalCompanyValue),
      latestClients: latestRaw.map((c) => this.toResponse(c)),
      chartData: chartRaw.map((r) => ({ month: r.month, count: Number(r.count) })),
    };
  }

  private toResponse(client: Client): ClientResponseDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      salary: Number(client.salary),
      companyValue: Number(client.companyValue),
      viewCount: client.viewCount,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
