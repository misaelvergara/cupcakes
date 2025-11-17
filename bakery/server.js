const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');
const cupcakesRouter = require('./routes/cupcakes');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes (devem vir ANTES do static)
app.use('/api/cupcakes', cupcakesRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bakery API is running! 🧁' });
});

// Serve Angular build (static files)
const distPath = path.join(__dirname, '../dist/cupcakes/browser');
const fs = require('fs');

// Verificar se o build existe
if (fs.existsSync(distPath)) {
  console.log('✅ Serving Angular build from:', distPath);
  app.use(express.static(distPath));

  // Fallback para SPA (Angular routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.error('❌ Angular build not found at:', distPath);
  console.error('Please run: npm run build');
  
  // Fallback quando não há build
  app.get('*', (req, res) => {
    res.status(503).json({ 
      error: 'Application not built',
      message: 'Please run "npm run build" first',
      path: distPath
    });
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!', 
    message: err.message 
  });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🧁 Bakery API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
