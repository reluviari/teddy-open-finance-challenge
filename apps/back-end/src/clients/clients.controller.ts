import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common';
import { ClientsService } from './clients.service';
import {
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
  ClientListResponseDto,
  DashboardResponseDto,
} from './dto';

/** Handles client-related HTTP requests. All routes require JWT authentication. */
@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Creates a new client. */
  @Post()
  @ApiOperation({ summary: 'Create a client' })
  @ApiResponse({ status: 201, description: 'Client created', type: ClientResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    return this.clientsService.create(createClientDto);
  }

  /** Lists active clients with optional pagination. */
  @Get()
  @ApiOperation({ summary: 'List all clients (supports ?page=1&limit=16)' })
  @ApiResponse({ status: 200, description: 'Client list', type: ClientListResponseDto })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ClientListResponseDto> {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.clientsService.findAll(pageNum, limitNum);
  }

  /** Returns dashboard aggregations: totals, latest clients, and monthly chart data. */
  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard stats (totals, latest, chart)' })
  @ApiResponse({ status: 200, description: 'Dashboard data', type: DashboardResponseDto })
  getDashboardStats(): Promise<DashboardResponseDto> {
    return this.clientsService.getDashboardStats();
  }

  /** Returns a single client and increments its view counter. */
  @Get(':id')
  @ApiOperation({ summary: 'Get client details (increments view counter)' })
  @ApiResponse({ status: 200, description: 'Client details', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClientResponseDto> {
    return this.clientsService.findOne(id);
  }

  /** Updates a client by ID. */
  @Put(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client updated', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  /** Soft deletes a client by ID. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a client' })
  @ApiResponse({ status: 204, description: 'Client deleted' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}
