import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common';

describe('App (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdClientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Health & Metrics', () => {
    it('GET /healthz should return ok', () => {
      return request(app.getHttpServer())
        .get('/healthz')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
        });
    });

    it('GET /metrics should return Prometheus text', () => {
      return request(app.getHttpServer())
        .get('/metrics')
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .expect((res) => {
          expect(res.text).toContain('# HELP');
          expect(res.text).toContain('# TYPE');
        });
    });
  });

  describe('Auth', () => {
    it('POST /auth/login with valid credentials should return token and name', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@teddy.com', password: 'password123' })
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.name).toBe('Administrador');
          token = res.body.accessToken;
        });
    });

    it('POST /auth/login with invalid credentials should return 401', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@teddy.com', password: 'wrong' })
        .expect(401);
    });

    it('POST /auth/login with invalid body should return 400', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'not-an-email' })
        .expect(400);
    });
  });

  describe('Clients CRUD (authenticated)', () => {
    it('GET /clients without token should return 401', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .expect(401);
    });

    it('GET /clients should return paginated list', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.total).toBeGreaterThanOrEqual(0);
        });
    });

    it('POST /clients should create a client', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'E2E Test Client', salary: 7500, companyValue: 250000 })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe('E2E Test Client');
          expect(res.body.salary).toBe(7500);
          expect(res.body.companyValue).toBe(250000);
          createdClientId = res.body.id;
        });
    });

    it('POST /clients with invalid body should return 400', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ salary: 'not-a-number' })
        .expect(400);
    });

    it('GET /clients/:id should return detail and increment viewCount', () => {
      return request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('E2E Test Client');
          expect(res.body.viewCount).toBe(1);
        });
    });

    it('GET /clients/:id again should have viewCount 2', () => {
      return request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.viewCount).toBe(2);
        });
    });

    it('PUT /clients/:id should update the client', () => {
      return request(app.getHttpServer())
        .put(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'E2E Updated Client' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('E2E Updated Client');
        });
    });

    it('GET /clients/:id with non-existent ID should return 404', () => {
      return request(app.getHttpServer())
        .get('/clients/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('DELETE /clients/:id should soft delete (204)', () => {
      return request(app.getHttpServer())
        .delete(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('GET /clients/:id after soft delete should return 404', () => {
      return request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('Dashboard', () => {
    it('GET /clients/dashboard should return stats', () => {
      return request(app.getHttpServer())
        .get('/clients/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.totalClients).toBeDefined();
          expect(res.body.totalCompanyValue).toBeDefined();
          expect(Array.isArray(res.body.latestClients)).toBe(true);
          expect(Array.isArray(res.body.chartData)).toBe(true);
        });
    });

    it('GET /clients/dashboard without token should return 401', () => {
      return request(app.getHttpServer())
        .get('/clients/dashboard')
        .expect(401);
    });
  });
});
