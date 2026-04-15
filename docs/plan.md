# Plano de Implementação

> Marque `[x]` conforme cada item for concluído.

## Fase 0 — Ajustes no scaffold ✅

- docker-compose.yml isolado por app
- .env.example e README.md por app
- Módulo de config centralizado (database, jwt)
- Diretório de migrations
- vitest.config.ts no frontend
- ESLint + Prettier na raiz
- Swagger em `/docs`

---

## Fase 1 — Auth backend ✅

- POST /auth/login com JWT
- src/auth/ — module, service, controller, DTOs
- src/common/ — exception filter, JWT guard, logging interceptor
- TypeORM config + User entity + migration
- Seed de usuário default
- Unit tests do auth service + controller

---

## Fase 2 — Login frontend ✅

- Login page com React Hook Form + validação
- useLogin (TanStack Query mutation)
- Loading, error e success states
- Redirect para dashboard
- ProtectedRoute + AuthContext
- Component test da login page

---

## Fase 3 — Clients CRUD ✅

- Entity com soft delete, timestamps, viewCount
- DTOs (create, update, response) com class-validator + Swagger
- Service (CRUD + soft delete + view counter)
- Controller fino com JwtAuthGuard + Swagger
- Migration para clients table
- Frontend: list, detail, form com hooks e estados explícitos
- Unit tests do clients service
- Component test da clients list page

---

## Fase 4 — Dashboard ✅

- GET /clients/dashboard (reutiliza ClientsService)
- Frontend: totals cards, latest clients, chart (recharts)
- Loading, error e empty states
- Component test da dashboard page

---

## Fase 5 — Docker e Observability ✅

- Dockerfiles (backend + frontend)
- docker-compose.yml raiz com stack completa
- GET /metrics (Prometheus exposition format)
- Structured JSON logger (JsonLoggerService)
- READMEs atualizados (raiz + apps)
- Seção de observabilidade no README raiz

---

## Fase 6 — Cobertura de testes e qualidade ✅

- Inventário de gaps de testes
- clients.controller.spec.ts (6 testes)
- health.controller.spec.ts (1 teste)
- metrics.service.spec.ts (3 testes)
- client-detail-page.test.tsx (4 testes)
- client-form-page.test.tsx (2 testes)
- ESLint + Prettier configurados e script de format adicionado

---

## Fase 7 — Revisar Swagger ✅

- Conferir que todos os endpoints têm decorators `@ApiOperation`, `@ApiResponse`
- Conferir que respostas correspondem aos DTOs reais
- Conferir `@ApiBearerAuth` em rotas protegidas
- Adicionado `@ApiResponse(401)` na classe do clients controller
- Adicionado `@ApiResponse(400)` em POST/PUT clients e POST auth/login
- Adicionado `@ApiResponse(200)` com schema tipado em healthz e metrics
- Criado `ChartDataItemDto` para tipar chartData no dashboard

---

## Fase 8 — Confirmar /metrics e logs JSON ✅

- `/metrics` retorna Prometheus válido (HELP, TYPE, gauge/counter, valores)
- Logs JSON no stdout com timestamp, level, context, message confirmados

---

## Fase 9 — Melhorar diagramas Mermaid ✅

- Diagrama no README raiz
- Diagrama no README do back-end
- Diagrama no README do front-end

---

## Fase 10 — Git e commits semânticos ✅

- Inicializar repositório git
- Commits semânticos por fase
- Repositório público no GitHub

---

## Fase 11 — E2E tests (diferencial) ✅

- Backend E2E com supertest: health, metrics, auth, CRUD completo, dashboard, 401
- Frontend E2E com Playwright: login, dashboard, clientes (criar, editar, excluir, detalhe)
- Scripts: test:e2e:back e test:e2e:front

---

## Fase 12 — Validar Docker build ✅

- Fix: `strictPropertyInitialization: false` no tsconfig do backend
- Fix: tipo `expiresIn` no jwt.config.ts
- Fix: `as unknown as` nos mocks de testes frontend
- Fix: `root` e `build.outDir` no vite.config.ts
- Fix: path do CMD no Dockerfile do backend
- Fix: `COPY --from=builder` para nginx.conf no Dockerfile do frontend
- Adicionado `.dockerignore`
- `docker compose up --build` — 3 containers rodando (postgres, back-end, front-end)
- Migrations executam corretamente (tabelas users e clients criadas)
- `GET /healthz` → `{"status":"ok"}`
- `GET /metrics` → Prometheus format válido
- `POST /auth/login` → JWT retornado
- CRUD de clients → create, list, dashboard funcionando
- Logs JSON estruturados no stdout confirmados
- Frontend servido via Nginx na porta 5173

---

## Fase 13 — Validação manual do fluxo completo ✅

- Login via API → JWT retornado com name
- Create client via API → cliente criado
- List clients via API → lista com 67 clientes do seed
- Dashboard via API → totais, latest (10), chartData com meses
- GET /clients/:id → detalhe com viewCount incremental
- PUT /clients/:id → atualização confirmada
- DELETE /clients/:id → 204 soft delete
- Fluxo completo via frontend (login → dashboard → clientes → detalhe → selecionados)

---

## Fase 14 — Verificar responsividade ✅

- Tabela do dashboard: overflow-x-auto para scroll horizontal em mobile
- Modais (criar/editar/excluir): margem lateral (px-4) em telas estreitas
- Toolbar de clientes: flex-wrap para empilhar em mobile
- Detail page: flex-wrap no header e botões para nomes longos

---

## Fase 15 — CI/CD (diferencial)

- GitHub Actions workflow para frontend (lint, test, build)
- GitHub Actions workflow para backend (lint, test, build)
- Pipelines separados usando Nx affected

---

## Fase 16 — Revisão final

- Conferir escopo (`docs/teddy-challenge-scope.md`) item a item
- Conferir regras (`.cursor/rules/`) — nenhuma violação aberta
- README raiz com visão geral, diagrama, instruções, escalabilidade
- Código-fonte completo e limpo

