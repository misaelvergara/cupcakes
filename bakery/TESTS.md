# Testes do Backend - Cupcakes API

## 📋 Visão Geral

Suite completa de testes unitários para a API REST do backend, cobrindo todas as rotas e funcionalidades do sistema de e-commerce de cupcakes.

## 🧪 Tecnologias Utilizadas

- **Jest** - Framework de testes
- **Supertest** - Testes de API HTTP
- **SQLite3** - Banco de dados em memória para testes

## 📊 Cobertura de Testes

```
File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|----------
All files      |   66.95 |    67.67 |   77.35 |   67.11
 bakery/routes |   88.32 |    78.66 |     100 |   88.14
  cupcakes.js  |   87.71 |    79.41 |     100 |   87.71
  orders.js    |   88.75 |    78.04 |     100 |   88.46
```

**Total: 40 testes** ✅

## 🚀 Executar Testes

```bash
# Executar todos os testes com cobertura
npm run test:backend

# Executar testes em modo watch (útil para desenvolvimento)
npm run test:backend:watch
```

## 📝 Estrutura dos Testes

### 1. **Testes de Database** (`bakery/database.test.js`)
- ✅ Inicialização do banco de dados
- ✅ Criação de tabelas (cupcakes, orders, order_items)
- ✅ População inicial de dados
- ✅ Validações de constraints (NOT NULL, CHECK)
- ✅ Relacionamentos entre tabelas

**Total: 13 testes**

### 2. **Testes de Cupcakes API** (`bakery/routes/cupcakes.test.js`)

#### GET /api/cupcakes
- ✅ Lista todos os cupcakes
- ✅ Retorna estrutura correta (id, name, price, image, description)

#### GET /api/cupcakes/:id
- ✅ Retorna cupcake específico
- ✅ Retorna 404 para ID inexistente

#### POST /api/cupcakes
- ✅ Cria novo cupcake
- ✅ Valida campos obrigatórios (name, price, image)
- ✅ Aceita cupcake sem descrição

#### PUT /api/cupcakes/:id
- ✅ Atualiza cupcake existente
- ✅ Retorna 404 para ID inexistente
- ✅ Valida campos obrigatórios

#### DELETE /api/cupcakes/:id
- ✅ Deleta cupcake existente
- ✅ Retorna 404 para ID inexistente

**Total: 12 testes**

### 3. **Testes de Orders API** (`bakery/routes/orders.test.js`)

#### GET /api/orders
- ✅ Retorna lista vazia quando não há pedidos
- ✅ Retorna lista de pedidos com itens

#### GET /api/orders/:id
- ✅ Retorna pedido específico com itens completos
- ✅ Retorna 404 para ID inexistente

#### POST /api/orders
- ✅ Cria novo pedido
- ✅ Valida campos obrigatórios (id, items, total, address, paymentMethod)
- ✅ Valida que items seja array não-vazio
- ✅ Cria pedido com múltiplos itens

#### PATCH /api/orders/:id/status
- ✅ Atualiza status para "sent"
- ✅ Atualiza status para "completed"
- ✅ Atualiza status para "cancelled"
- ✅ Valida status inválidos
- ✅ Retorna 404 para ID inexistente

#### DELETE /api/orders/:id
- ✅ Deleta pedido existente
- ✅ Retorna 404 para ID inexistente

**Total: 15 testes**

## 🔍 Exemplos de Testes

### Teste de Criação de Cupcake
```javascript
it('deve criar um novo cupcake', async () => {
  const newCupcake = {
    name: 'Test Cupcake',
    price: 15.99,
    image: 'https://example.com/test.jpg',
    description: 'Um cupcake de teste'
  };

  const response = await request(app)
    .post('/api/cupcakes')
    .send(newCupcake)
    .expect('Content-Type', /json/)
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe(newCupcake.name);
  expect(response.body.price).toBe(newCupcake.price);
});
```

### Teste de Validação
```javascript
it('deve retornar erro 400 se faltar campos obrigatórios', async () => {
  const invalidCupcake = {
    name: 'Incomplete Cupcake'
    // falta price e image
  };

  const response = await request(app)
    .post('/api/cupcakes')
    .send(invalidCupcake)
    .expect('Content-Type', /json/)
    .expect(400);

  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toContain('Missing required fields');
});
```

### Teste de Relacionamento (Orders com Items)
```javascript
it('deve criar pedido com múltiplos itens', async () => {
  const multiItemOrder = {
    id: 'multi-item-order',
    items: [
      {
        cupcake: { id: testCupcakeId, name: 'Cupcake 1', price: 10.00, ... },
        quantity: 2
      },
      {
        cupcake: { id: testCupcakeId, name: 'Cupcake 2', price: 15.00, ... },
        quantity: 3
      }
    ],
    total: 65.00,
    address: 'Rua Multi, 999',
    paymentMethod: 'pix'
  };

  const response = await request(app)
    .post('/api/orders')
    .send(multiItemOrder)
    .expect(201);

  expect(response.body.items.length).toBe(2);
  expect(response.body.total).toBe(65.00);
});
```

## 🎯 Boas Práticas Implementadas

1. **Isolamento de Testes**
   - Cada suite usa banco de dados em memória independente
   - IDs únicos com timestamps para evitar colisões

2. **Testes Descritivos**
   - Nomes claros e objetivos
   - Agrupamento lógico com `describe`

3. **Cobertura Completa**
   - Casos de sucesso
   - Casos de erro (400, 404, 500)
   - Validações de entrada
   - Edge cases

4. **Setup e Teardown**
   - `beforeAll` para inicialização única
   - `beforeEach` para setup por teste
   - `afterAll` para cleanup

5. **Assertions Claras**
   - Verificação de status HTTP
   - Validação de estrutura de dados
   - Checagem de erros específicos

## 📈 Próximos Passos

Para aumentar a cobertura:

1. Adicionar testes de integração end-to-end
2. Testar casos de erro de banco de dados
3. Adicionar testes de performance
4. Implementar testes de carga com k6 ou Artillery
5. Adicionar testes de segurança (SQL injection, XSS, etc.)

## 🐛 Debug de Testes

Para debugar um teste específico:

```bash
# Rodar apenas um arquivo
npm run test:backend -- bakery/routes/cupcakes.test.js

# Rodar apenas um teste específico
npm run test:backend -- -t "deve criar um novo cupcake"

# Modo verbose para mais detalhes
npm run test:backend -- --verbose
```

## 📚 Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [SQLite3 Node.js](https://github.com/TryGhost/node-sqlite3)
