const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');

// GET /api/orders - Listar todos os pedidos com seus itens
router.get('/', (req, res) => {
  const db = getDatabase();
  
  // Busca todos os pedidos
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (orders.length === 0) {
      return res.json([]);
    }
    
    // Para cada pedido, busca seus itens
    let completed = 0;
    const ordersWithItems = [];
    
    orders.forEach((order, index) => {
      const sql = `
        SELECT 
          oi.quantity,
          oi.price,
          c.id as cupcake_id,
          c.name as cupcake_name,
          c.image as cupcake_image,
          c.description as cupcake_description
        FROM order_items oi
        JOIN cupcakes c ON oi.cupcake_id = c.id
        WHERE oi.order_id = ?
      `;
      
      db.all(sql, [order.id], (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        // Formata os itens para o formato esperado pelo frontend
        const formattedItems = items.map(item => ({
          quantity: item.quantity,
          cupcake: {
            id: item.cupcake_id,
            name: item.cupcake_name,
            price: item.price,
            image: item.cupcake_image,
            description: item.cupcake_description
          }
        }));
        
        ordersWithItems[index] = {
          id: order.id,
          items: formattedItems,
          total: order.total,
          address: order.address,
          paymentMethod: order.payment_method,
          status: order.status,
          date: new Date(order.created_at)
        };
        
        completed++;
        if (completed === orders.length) {
          res.json(ordersWithItems);
        }
      });
    });
  });
});

// GET /api/orders/:id - Buscar um pedido específico
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Busca os itens do pedido
    const sql = `
      SELECT 
        oi.quantity,
        oi.price,
        c.id as cupcake_id,
        c.name as cupcake_name,
        c.image as cupcake_image,
        c.description as cupcake_description
      FROM order_items oi
      JOIN cupcakes c ON oi.cupcake_id = c.id
      WHERE oi.order_id = ?
    `;
    
    db.all(sql, [id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const formattedItems = items.map(item => ({
        quantity: item.quantity,
        cupcake: {
          id: item.cupcake_id,
          name: item.cupcake_name,
          price: item.price,
          image: item.cupcake_image,
          description: item.cupcake_description
        }
      }));
      
      res.json({
        id: order.id,
        items: formattedItems,
        total: order.total,
        address: order.address,
        paymentMethod: order.payment_method,
        status: order.status,
        date: new Date(order.created_at)
      });
    });
  });
});

// POST /api/orders - Criar novo pedido
router.post('/', (req, res) => {
  const db = getDatabase();
  const { id, items, total, address, paymentMethod } = req.body;
  
  // Validação
  if (!id || !items || !total || !address || !paymentMethod) {
    return res.status(400).json({ 
      error: 'Missing required fields: id, items, total, address, paymentMethod' 
    });
  }
  
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items must be a non-empty array' });
  }
  
  // Insere o pedido
  const orderSql = `
    INSERT INTO orders (id, total, address, payment_method, status) 
    VALUES (?, ?, ?, ?, 'pending')
  `;
  
  db.run(orderSql, [id, total, address, paymentMethod], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Insere os itens do pedido
    const itemSql = `
      INSERT INTO order_items (order_id, cupcake_id, quantity, price) 
      VALUES (?, ?, ?, ?)
    `;
    
    const stmt = db.prepare(itemSql);
    
    items.forEach(item => {
      stmt.run([id, item.cupcake.id, item.quantity, item.cupcake.price]);
    });
    
    stmt.finalize((err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Retorna o pedido criado
      res.status(201).json({
        id,
        items,
        total,
        address,
        paymentMethod,
        status: 'pending',
        date: new Date()
      });
    });
  });
});

// PATCH /api/orders/:id/status - Atualizar status do pedido
router.patch('/:id/status', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { status } = req.body;
  
  // Validação
  const validStatuses = ['pending', 'sent', 'completed', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    });
  }
  
  db.run(
    'UPDATE orders SET status = ? WHERE id = ?', 
    [status, id], 
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ 
        message: 'Order status updated successfully', 
        id, 
        status 
      });
    }
  );
});

// DELETE /api/orders/:id - Deletar pedido (opcional, para testes)
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  // SQLite vai deletar os itens automaticamente (CASCADE)
  db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully', id });
  });
});

module.exports = router;
