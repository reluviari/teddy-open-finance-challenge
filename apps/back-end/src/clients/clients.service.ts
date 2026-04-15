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
const SEED_COUNT = 67;

const SEED_NAMES = [
  'Eduardo Silva', 'Ana Oliveira', 'Carlos Santos', 'Mariana Costa', 'João Pereira',
  'Fernanda Lima', 'Pedro Almeida', 'Juliana Ferreira', 'Lucas Rodrigues', 'Camila Souza',
  'Rafael Martins', 'Beatriz Araújo', 'Gabriel Ribeiro', 'Larissa Gomes', 'Gustavo Barbosa',
  'Amanda Cardoso', 'Diego Nascimento', 'Patrícia Mendes', 'Bruno Cavalcanti', 'Letícia Moreira',
  'Thiago Teixeira', 'Natália Vieira', 'Felipe Carvalho', 'Isabela Monteiro', 'Rodrigo Pinto',
  'Carolina Correia', 'Marcelo Duarte', 'Daniela Freitas', 'André Machado', 'Renata Nunes',
  'Leonardo Azevedo', 'Vanessa Campos', 'Vinícius Rocha', 'Tatiana Dias', 'Henrique Ramos',
  'Priscila Castro', 'Matheus Lopes', 'Aline Moura', 'Ricardo Cunha', 'Cláudia Borges',
  'Alexandre Fonseca', 'Simone Rezende', 'Fábio Peixoto', 'Eliane Coelho', 'Leandro Melo',
  'Cristina Braga', 'Sérgio Miranda', 'Michele Tavares', 'Paulo Andrade', 'Sandra Batista',
  'Roberto Nogueira', 'Adriana Pires', 'Daniel Vasconcelos', 'Luciana Sampaio', 'Marcos Aguiar',
  'Raquel Brito', 'Guilherme Farias', 'Débora Medeiros', 'Antônio Barreto', 'Viviane Assis',
  'José Lacerda', 'Rosana Guimarães', 'Márcio Siqueira', 'Tânia Alencar', 'Wellington Franco',
  'Elisa Domingues', 'Caio Monteiro',
];

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

  /** Seeds the clients table with sample data if empty. Idempotent. */
  async seedClients(): Promise<void> {
    const count = await this.clientRepository.count();
    if (count > 0) return;

    const startDate = new Date('2025-04-01T00:00:00Z');
    const endDate = new Date('2026-03-31T23:59:59Z');
    const dateRange = endDate.getTime() - startDate.getTime();

    const clients = SEED_NAMES.slice(0, SEED_COUNT).map((name, i) => {
      const seed = (i * 7919 + 1301) % 10000;
      const salary = 3500 + (seed / 10000) * (23000 - 3500);
      const companySeed = ((i * 6571 + 3037) % 10000);
      const companyValue = 30000 + (companySeed / 10000) * (4000000 - 30000);
      const dateSeed = ((i * 4391 + 2063) % 10000);
      const createdAt = new Date(startDate.getTime() + (dateSeed / 10000) * dateRange);

      return this.clientRepository.create({
        name,
        salary: Math.round(salary * 100) / 100,
        companyValue: Math.round(companyValue * 100) / 100,
        createdAt,
      });
    });

    await this.clientRepository.save(clients);
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
