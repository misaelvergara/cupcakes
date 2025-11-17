const request = require('supertest');
const express = require('express');
const cupcakesRouter = require('./cupcakes');
const { initDatabase, getDatabase } = require('../database');

// Setup do app de teste
const app = express();
app.use(express.json());
app.use('/api/cupcakes', cupcakesRouter);

describe('Cupcakes API', () => {
  beforeAll(async () => {
    // Inicializa o banco de dados em memória para testes
    await initDatabase(':memory:');
  });

  afterAll(() => {
    const db = getDatabase();
    if (db) {
      db.close();
    }
  });

  describe('GET /api/cupcakes', () => {
    it('deve retornar lista de cupcakes', async () => {
      const response = await request(app)
        .get('/api/cupcakes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('deve retornar cupcakes com estrutura correta', async () => {
      const response = await request(app).get('/api/cupcakes');
      
      const cupcake = response.body[0];
      expect(cupcake).toHaveProperty('id');
      expect(cupcake).toHaveProperty('name');
      expect(cupcake).toHaveProperty('price');
      expect(cupcake).toHaveProperty('image');
      expect(cupcake).toHaveProperty('description');
    });
  });

  describe('GET /api/cupcakes/:id', () => {
    it('deve retornar um cupcake específico', async () => {
      const response = await request(app)
        .get('/api/cupcakes/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('deve retornar 404 para cupcake inexistente', async () => {
      const response = await request(app)
        .get('/api/cupcakes/9999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Cupcake not found');
    });
  });

  describe('POST /api/cupcakes', () => {
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

    it('deve aceitar cupcake sem descrição', async () => {
      const cupcakeWithoutDesc = {
        name: 'No Desc Cupcake',
        price: 12.50,
        image: 'https://example.com/nodesc.jpg'
      };

      const response = await request(app)
        .post('/api/cupcakes')
        .send(cupcakeWithoutDesc)
        .expect(201);

      expect(response.body).toHaveProperty('description');
    });
  });

  describe('PUT /api/cupcakes/:id', () => {
    let testCupcakeId;

    beforeAll(async () => {
      // Cria um cupcake para testar update
      const response = await request(app)
        .post('/api/cupcakes')
        .send({
          name: 'Update Test',
          price: 10.00,
          image: 'https://example.com/update.jpg',
          description: 'Para testar update'
        });
      testCupcakeId = response.body.id;
    });

    it('deve atualizar um cupcake existente', async () => {
      const updatedData = {
        name: 'Updated Cupcake',
        price: 20.00,
        image: 'https://example.com/updated.jpg',
        description: 'Descrição atualizada'
      };

      const response = await request(app)
        .put(`/api/cupcakes/${testCupcakeId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.id).toBe(testCupcakeId);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.price).toBe(updatedData.price);
    });

    it('deve retornar 404 ao tentar atualizar cupcake inexistente', async () => {
      const response = await request(app)
        .put('/api/cupcakes/9999')
        .send({
          name: 'Non-existent',
          price: 10.00,
          image: 'https://example.com/none.jpg'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Cupcake not found');
    });

    it('deve retornar erro 400 se faltar campos obrigatórios', async () => {
      const response = await request(app)
        .put(`/api/cupcakes/${testCupcakeId}`)
        .send({ name: 'Only Name' })
        .expect(400);

      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('DELETE /api/cupcakes/:id', () => {
    let deleteCupcakeId;

    beforeEach(async () => {
      // Cria um cupcake para deletar
      const response = await request(app)
        .post('/api/cupcakes')
        .send({
          name: 'Delete Test',
          price: 5.00,
          image: 'https://example.com/delete.jpg'
        });
      deleteCupcakeId = response.body.id;
    });

    it('deve deletar um cupcake existente', async () => {
      const response = await request(app)
        .delete(`/api/cupcakes/${deleteCupcakeId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Cupcake deleted successfully');
      expect(response.body.id).toBe(deleteCupcakeId);

      // Verifica se foi realmente deletado
      await request(app)
        .get(`/api/cupcakes/${deleteCupcakeId}`)
        .expect(404);
    });

    it('deve retornar 404 ao tentar deletar cupcake inexistente', async () => {
      const response = await request(app)
        .delete('/api/cupcakes/9999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Cupcake not found');
    });
  });
});
