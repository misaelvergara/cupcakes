const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database');

// GET /api/cupcakes - Listar todos os cupcakes
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM cupcakes ORDER BY id', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/cupcakes/:id - Buscar um cupcake específico
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get('SELECT * FROM cupcakes WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Cupcake not found' });
    }
    res.json(row);
  });
});

// POST /api/cupcakes - Criar novo cupcake
router.post('/', (req, res) => {
  const db = getDatabase();
  const { name, price, image, description } = req.body;
  
  // Validação
  if (!name || !price || !image) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, price, image' 
    });
  }
  
  const sql = `
    INSERT INTO cupcakes (name, price, image, description) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(sql, [name, price, image, description || ''], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Retorna o cupcake criado
    db.get('SELECT * FROM cupcakes WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });
});

// PUT /api/cupcakes/:id - Atualizar cupcake
router.put('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { name, price, image, description } = req.body;
  
  // Validação
  if (!name || !price || !image) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, price, image' 
    });
  }
  
  const sql = `
    UPDATE cupcakes 
    SET name = ?, price = ?, image = ?, description = ?
    WHERE id = ?
  `;
  
  db.run(sql, [name, price, image, description || '', id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cupcake not found' });
    }
    
    // Retorna o cupcake atualizado
    db.get('SELECT * FROM cupcakes WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// DELETE /api/cupcakes/:id - Deletar cupcake
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run('DELETE FROM cupcakes WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cupcake not found' });
    }
    
    res.json({ message: 'Cupcake deleted successfully', id: parseInt(id) });
  });
});

module.exports = router;
