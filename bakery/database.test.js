const { initDatabase, getDatabase } = require('./database');
const sqlite3 = require('sqlite3').verbose();

describe('Database Module', () => {
  let testDb;

  afterAll(() => {
    if (testDb) {
      testDb.close();
      testDb = null;
    }
  });

  describe('initDatabase', () => {
    it('deve inicializar banco de dados em memória', async () => {
      await expect(initDatabase(':memory:')).resolves.not.toThrow();
      testDb = getDatabase();
      expect(testDb).toBeTruthy();
    });

    it('deve criar tabela cupcakes', async () => {
      await initDatabase(':memory:');
      testDb = getDatabase();

      return new Promise((resolve, reject) => {
        testDb.get(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='cupcakes'",
          (err, row) => {
            if (err) reject(err);
            expect(row).toBeTruthy();
            expect(row.name).toBe('cupcakes');
            resolve();
          }
        );
      });
    });

    it('deve criar tabela orders', async () => {
      await initDatabase(':memory:');
      testDb = getDatabase();

      return new Promise((resolve, reject) => {
        testDb.get(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='orders'",
          (err, row) => {
            if (err) reject(err);
            expect(row).toBeTruthy();
            expect(row.name).toBe('orders');
            resolve();
          }
        );
      });
    });

    it('deve criar tabela order_items', async () => {
      await initDatabase(':memory:');
      testDb = getDatabase();

      return new Promise((resolve, reject) => {
        testDb.get(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='order_items'",
          (err, row) => {
            if (err) reject(err);
            expect(row).toBeTruthy();
            expect(row.name).toBe('order_items');
            resolve();
          }
        );
      });
    });

    it('deve popular banco com cupcakes iniciais', async () => {
      await initDatabase(':memory:');
      testDb = getDatabase();

      return new Promise((resolve, reject) => {
        testDb.all('SELECT * FROM cupcakes', (err, rows) => {
          if (err) reject(err);
          expect(rows.length).toBeGreaterThan(0);
          
          // Verifica estrutura de um cupcake
          expect(rows[0]).toHaveProperty('id');
          expect(rows[0]).toHaveProperty('name');
          expect(rows[0]).toHaveProperty('price');
          expect(rows[0]).toHaveProperty('image');
          expect(rows[0]).toHaveProperty('description');
          resolve();
        });
      });
    });

    it('deve criar cupcakes com preços válidos', async () => {
      await initDatabase(':memory:');
      testDb = getDatabase();

      return new Promise((resolve, reject) => {
        testDb.all('SELECT * FROM cupcakes', (err, rows) => {
          if (err) reject(err);
          
          rows.forEach(cupcake => {
            expect(cupcake.price).toBeGreaterThan(0);
            expect(typeof cupcake.price).toBe('number');
          });
          resolve();
        });
      });
    });
  });

  describe('getDatabase', () => {
    it('deve retornar instância do banco de dados', async () => {
      await initDatabase(':memory:');
      const db = getDatabase();
      
      expect(db).toBeTruthy();
      expect(db.constructor.name).toBe('Database');
      testDb = db;
    });

    it('deve retornar a mesma instância em múltiplas chamadas', async () => {
      await initDatabase(':memory:');
      const db1 = getDatabase();
      const db2 = getDatabase();
      
      expect(db1).toBe(db2);
      testDb = db1;
    });
  });

  describe('Database Constraints', () => {
    beforeAll(async () => {
      await initDatabase(':memory:');
      testDb = getDatabase();
    });

    it('deve rejeitar cupcake sem nome', (done) => {
      testDb.run(
        'INSERT INTO cupcakes (price, image) VALUES (?, ?)',
        [10.00, 'test.jpg'],
        (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toContain('NOT NULL');
          done();
        }
      );
    });

    it('deve rejeitar cupcake sem preço', (done) => {
      testDb.run(
        'INSERT INTO cupcakes (name, image) VALUES (?, ?)',
        ['Test', 'test.jpg'],
        (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toContain('NOT NULL');
          done();
        }
      );
    });

    it('deve rejeitar pedido com status inválido', (done) => {
      testDb.run(
        'INSERT INTO orders (id, total, address, payment_method, status) VALUES (?, ?, ?, ?, ?)',
        ['test-1', 10.00, 'Rua Test', 'pix', 'invalid_status'],
        (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toContain('CHECK constraint');
          done();
        }
      );
    });

    it('deve aceitar todos os status válidos', (done) => {
      const validStatuses = ['pending', 'sent', 'completed', 'cancelled'];
      const uniqueId = Date.now();
      
      testDb.run(
        'INSERT INTO orders (id, total, address, payment_method, status) VALUES (?, ?, ?, ?, ?)',
        [`test-pending-${uniqueId}`, 10.00, 'Rua Test', 'pix', 'pending'],
        (err) => {
          expect(err).toBeFalsy();
          
          testDb.run(
            'INSERT INTO orders (id, total, address, payment_method, status) VALUES (?, ?, ?, ?, ?)',
            [`test-sent-${uniqueId}`, 10.00, 'Rua Test', 'pix', 'sent'],
            (err) => {
              expect(err).toBeFalsy();
              done();
            }
          );
        }
      );
    });

    it('deve permitir inserir order_items vinculados a um pedido', (done) => {
      const uniqueId = `order-items-test-${Date.now()}`;
      
      // Insere um pedido
      testDb.run(
        'INSERT INTO orders (id, total, address, payment_method) VALUES (?, ?, ?, ?)',
        [uniqueId, 50.00, 'Rua Test', 'pix'],
        (err) => {
          expect(err).toBeFalsy();
          
          // Insere itens do pedido
          testDb.run(
            'INSERT INTO order_items (order_id, cupcake_id, quantity, price) VALUES (?, ?, ?, ?)',
            [uniqueId, 1, 2, 10.00],
            (err) => {
              expect(err).toBeFalsy();
              
              // Verifica se o item foi inserido
              testDb.all(
                'SELECT * FROM order_items WHERE order_id = ?',
                [uniqueId],
                (err, rows) => {
                  expect(err).toBeFalsy();
                  expect(rows.length).toBe(1);
                  expect(rows[0].quantity).toBe(2);
                  expect(rows[0].price).toBe(10.00);
                  done();
                }
              );
            }
          );
        }
      );
    });
  });
});
