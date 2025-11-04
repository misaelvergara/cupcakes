const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'cupcakes.db');
let db = null;

// Conecta ao banco de dados
function getDatabase() {
  if (db) return db;
  
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('✅ Connected to SQLite database');
    }
  });
  
  return db;
}

// Cria as tabelas
function createTables() {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de Cupcakes
      db.run(`
        CREATE TABLE IF NOT EXISTS cupcakes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Tabela de Pedidos
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          total REAL NOT NULL,
          address TEXT NOT NULL,
          payment_method TEXT NOT NULL CHECK(payment_method IN ('credit', 'pix')),
          status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'completed', 'cancelled')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Tabela de Itens do Pedido
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT NOT NULL,
          cupcake_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (cupcake_id) REFERENCES cupcakes(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Insere dados iniciais (seed)
function seedDatabase() {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM cupcakes', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Se já tem dados, não faz seed
      if (row.count > 0) {
        console.log('✅ Database already seeded');
        resolve();
        return;
      }
      
      // Insere cupcakes iniciais
      const stmt = db.prepare(`
        INSERT INTO cupcakes (name, price, image, description) 
        VALUES (?, ?, ?, ?)
      `);
      
      const initialCupcakes = [
        {
          name: 'Cupcakke de morango',
          price: 10.89,
          image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop',
          description: 'Delicioso cupcake de morango com cobertura cremosa'
        },
        {
          name: 'Cupcakke de maracujá',
          price: 10.89,
          image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&h=400&fit=crop',
          description: 'Cupcake tropical de maracujá com decoração especial'
        }
      ];
      
      initialCupcakes.forEach(cupcake => {
        stmt.run([cupcake.name, cupcake.price, cupcake.image, cupcake.description]);
      });
      
      stmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Database seeded with initial data');
          resolve();
        }
      });
    });
  });
}

// Inicializa o banco de dados
async function initDatabase() {
  try {
    await createTables();
    await seedDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Fecha a conexão
function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

module.exports = {
  getDatabase,
  initDatabase,
  closeDatabase
};
