const request = require('supertest');
const express = require('express');
const ordersRouter = require('./orders');
const cupcakesRouter = require('./cupcakes');
const { initDatabase, getDatabase } = require('../database');

// Setup do app de teste
const app = express();
app.use(express.json());
app.use('/api/orders', ordersRouter);
app.use('/api/cupcakes', cupcakesRouter);

describe('Orders API', () => {
  let testCupcakeId;

  beforeAll(async () => {
    // Inicializa o banco de dados em memória para testes
    await initDatabase(':memory:');
    
    // Cria um cupcake para usar nos testes de pedidos
    const response = await request(app)
      .post('/api/cupcakes')
      .send({
        name: 'Test Order Cupcake',
        price: 10.00,
        image: 'https://example.com/test.jpg',
        description: 'Para testes de pedidos'
      });
    testCupcakeId = response.body.id;
  });

  afterAll(() => {
    const db = getDatabase();
    if (db) {
      db.close();
    }
  });

  describe('GET /api/orders', () => {
    it('deve retornar lista vazia quando não há pedidos', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve retornar lista de pedidos após criar um', async () => {
      // Cria um pedido primeiro
      await request(app)
        .post('/api/orders')
        .send({
          id: `test-order-${Date.now()}`,
          items: [
            {
              cupcake: {
                id: testCupcakeId,
                name: 'Test Cupcake',
                price: 10.00,
                image: 'https://example.com/test.jpg'
              },
              quantity: 2
            }
          ],
          total: 20.00,
          address: 'Rua Teste, 123',
          paymentMethod: 'pix'
        });

      const response = await request(app).get('/api/orders');
      
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('items');
      expect(response.body[0]).toHaveProperty('total');
      expect(response.body[0]).toHaveProperty('status');
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      // Cria um pedido para testar
      const uniqueId = `test-order-get-${Date.now()}`;
      const response = await request(app)
        .post('/api/orders')
        .send({
          id: uniqueId,
          items: [
            {
              cupcake: {
                id: testCupcakeId,
                name: 'Test Cupcake',
                price: 10.00,
                image: 'https://example.com/test.jpg'
              },
              quantity: 3
            }
          ],
          total: 30.00,
          address: 'Rua Get Test, 456',
          paymentMethod: 'pix'
        });
      orderId = response.body.id;
    });

    it('deve retornar um pedido específico com itens', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id', orderId);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total', 30.00);
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('paymentMethod');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items[0]).toHaveProperty('quantity');
      expect(response.body.items[0]).toHaveProperty('cupcake');
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const response = await request(app)
        .get('/api/orders/non-existent-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Order not found');
    });
  });

  describe('POST /api/orders', () => {
    it('deve criar um novo pedido', async () => {
      const newOrder = {
        id: `test-order-post-${Date.now()}`,
        items: [
          {
            cupcake: {
              id: testCupcakeId,
              name: 'Test Cupcake',
              price: 10.00,
              image: 'https://example.com/test.jpg'
            },
            quantity: 5
          }
        ],
        total: 50.00,
        address: 'Rua Post Test, 789',
        paymentMethod: 'pix'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(newOrder)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id', newOrder.id);
      expect(response.body).toHaveProperty('total', 50.00);
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body).toHaveProperty('date');
    });

    it('deve retornar erro 400 se faltar campos obrigatórios', async () => {
      const invalidOrder = {
        id: `invalid-order-${Date.now()}`,
        // falta items, total, address, paymentMethod
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toContain('Missing required fields');
    });

    it('deve retornar erro 400 se items for array vazio', async () => {
      const orderWithEmptyItems = {
        id: `empty-items-${Date.now()}`,
        items: [],
        total: 10.00,
        address: 'Rua Vazia',
        paymentMethod: 'pix'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderWithEmptyItems)
        .expect(400);

      expect(response.body.error).toBe('Items must be a non-empty array');
    });

    it('deve criar pedido com múltiplos itens', async () => {
      const multiItemOrder = {
        id: `multi-item-order-${Date.now()}`,
        items: [
          {
            cupcake: {
              id: testCupcakeId,
              name: 'Cupcake 1',
              price: 10.00,
              image: 'https://example.com/1.jpg'
            },
            quantity: 2
          },
          {
            cupcake: {
              id: testCupcakeId,
              name: 'Cupcake 2',
              price: 15.00,
              image: 'https://example.com/2.jpg'
            },
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
  });

  describe('PATCH /api/orders/:id/status', () => {
    let statusOrderId;

    beforeEach(async () => {
      // Cria um pedido para testar alteração de status
      const uniqueId = `status-order-${Date.now()}-${Math.random()}`;
      const response = await request(app)
        .post('/api/orders')
        .send({
          id: uniqueId,
          items: [
            {
              cupcake: {
                id: testCupcakeId,
                name: 'Status Test',
                price: 10.00,
                image: 'https://example.com/status.jpg'
              },
              quantity: 1
            }
          ],
          total: 10.00,
          address: 'Rua Status, 111',
          paymentMethod: 'pix'
        });
      statusOrderId = response.body.id;
    });

    it('deve atualizar status do pedido para "sent"', async () => {
      const response = await request(app)
        .patch(`/api/orders/${statusOrderId}/status`)
        .send({ status: 'sent' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Order status updated successfully');
      expect(response.body).toHaveProperty('status', 'sent');

      // Verifica se foi realmente atualizado
      const getResponse = await request(app).get(`/api/orders/${statusOrderId}`);
      expect(getResponse.body.status).toBe('sent');
    });

    it('deve atualizar status para "completed"', async () => {
      const response = await request(app)
        .patch(`/api/orders/${statusOrderId}/status`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.status).toBe('completed');
    });

    it('deve atualizar status para "cancelled"', async () => {
      const response = await request(app)
        .patch(`/api/orders/${statusOrderId}/status`)
        .send({ status: 'cancelled' })
        .expect(200);

      expect(response.body.status).toBe('cancelled');
    });

    it('deve retornar erro 400 para status inválido', async () => {
      const response = await request(app)
        .patch(`/api/orders/${statusOrderId}/status`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.error).toContain('Status must be one of');
    });

    it('deve retornar erro 404 para pedido inexistente', async () => {
      const response = await request(app)
        .patch('/api/orders/non-existent/status')
        .send({ status: 'sent' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Order not found');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    let deleteOrderId;

    beforeEach(async () => {
      // Cria um pedido para deletar
      const uniqueId = `delete-order-${Date.now()}-${Math.random()}`;
      const response = await request(app)
        .post('/api/orders')
        .send({
          id: uniqueId,
          items: [
            {
              cupcake: {
                id: testCupcakeId,
                name: 'Delete Test',
                price: 10.00,
                image: 'https://example.com/delete.jpg'
              },
              quantity: 1
            }
          ],
          total: 10.00,
          address: 'Rua Delete, 222',
          paymentMethod: 'pix'
        });
      deleteOrderId = response.body.id;
    });

    it('deve deletar um pedido existente', async () => {
      const response = await request(app)
        .delete(`/api/orders/${deleteOrderId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Order deleted successfully');

      // Verifica se foi realmente deletado
      await request(app)
        .get(`/api/orders/${deleteOrderId}`)
        .expect(404);
    });

    it('deve retornar 404 ao tentar deletar pedido inexistente', async () => {
      const response = await request(app)
        .delete('/api/orders/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Order not found');
    });
  });
});
