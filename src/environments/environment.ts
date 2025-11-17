// Detecta automaticamente se está em desenvolvimento ou produção
// Em dev: usa localhost:3000 explicitamente
// Em prod: usa URL relativa (mesma origem do frontend)
const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

export const environment = {
  production: false,
  apiUrl: isLocalhost ? 'http://localhost:3000/api' : '/api'
};
