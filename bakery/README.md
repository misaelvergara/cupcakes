# 🧁 Bakery API

Backend da aplicação Cupcakes Gourmet - Uma API RESTful simples construída com Express.js e SQLite.

## 🚀 Como Rodar

### Instalar dependências
```bash
npm install
```

### Rodar apenas o backend
```bash
npm run server
```

### Rodar backend com auto-reload (desenvolvimento)
```bash
npm run dev:server
```

### Rodar frontend + backend simultaneamente
```bash
npm run dev
```

## 📊 Banco de Dados

O projeto usa **SQLite** com as seguintes tabelas:

### Tabela `cupcakes`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Primary Key (auto-increment) |
| name | TEXT | Nome do cupcake |
| price | REAL | Preço |
| image | TEXT | URL da imagem |
| description | TEXT | Descrição (opcional) |
| created_at | DATETIME | Data de criação |

### Tabela `orders`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT | Primary Key (UUID do frontend) |
| total | REAL | Valor total do pedido |
| address | TEXT | Endereço de entrega |
| payment_method | TEXT | 'credit' ou 'pix' |
| status | TEXT | 'pending', 'sent', 'completed', 'cancelled' |
| created_at | DATETIME | Data de criação |

### Tabela `order_items`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Primary Key (auto-increment) |
| order_id | TEXT | FK para orders |
| cupcake_id | INTEGER | FK para cupcakes |
| quantity | INTEGER | Quantidade |
| price | REAL | Preço unitário no momento da compra |

## 📡 Endpoints da API

### Health Check
```
GET /api/health
```
Verifica se a API está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "Bakery API is running! 🧁"
}
```

---

### Cupcakes

#### Listar todos os cupcakes
```
GET /api/cupcakes
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Cupcakke de morango",
    "price": 10.89,
    "image": "https://...",
    "description": "Delicioso cupcake...",
    "created_at": "2024-11-15T..."
  }
]
```

#### Buscar cupcake por ID
```
GET /api/cupcakes/:id
```

#### Criar novo cupcake
```
POST /api/cupcakes
Content-Type: application/json

{
  "name": "Cupcake de chocolate",
  "price": 12.50,
  "image": "https://...",
  "description": "Opcional"
}
```

#### Atualizar cupcake
```
PUT /api/cupcakes/:id
Content-Type: application/json

{
  "name": "Cupcake de chocolate premium",
  "price": 15.00,
  "image": "https://...",
  "description": "Atualizado"
}
```

#### Deletar cupcake
```
DELETE /api/cupcakes/:id
```

---

### Pedidos

#### Listar todos os pedidos
```
GET /api/orders
```

**Resposta:**
```json
[
  {
    "id": "ORD-1234567890-abc",
    "items": [
      {
        "quantity": 2,
        "cupcake": {
          "id": 1,
          "name": "Cupcake de morango",
          "price": 10.89,
          "image": "https://...",
          "description": "..."
        }
      }
    ],
    "total": 21.78,
    "address": "Rua das Flores, 123",
    "paymentMethod": "credit",
    "status": "pending",
    "date": "2024-11-15T..."
  }
]
```

#### Buscar pedido por ID
```
GET /api/orders/:id
```

#### Criar novo pedido
```
POST /api/orders
Content-Type: application/json

{
  "id": "ORD-1234567890-abc",
  "items": [
    {
      "quantity": 2,
      "cupcake": {
        "id": 1,
        "name": "Cupcake de morango",
        "price": 10.89,
        "image": "https://...",
        "description": "..."
      }
    }
  ],
  "total": 21.78,
  "address": "Rua das Flores, 123",
  "paymentMethod": "credit"
}
```

#### Atualizar status do pedido
```
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "sent"
}
```

Status válidos: `pending`, `sent`, `completed`, `cancelled`

#### Deletar pedido
```
DELETE /api/orders/:id
```

---

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados local
- **CORS** - Middleware para permitir requisições cross-origin

## 📂 Estrutura de Arquivos

```
bakery/
├── server.js           # Servidor Express principal
├── database.js         # Configuração e inicialização do SQLite
├── routes/
│   ├── cupcakes.js     # Rotas de cupcakes
│   └── orders.js       # Rotas de pedidos
└── cupcakes.db         # Banco de dados SQLite (gerado automaticamente)
```

## 🔧 Configuração

### Porta do servidor
Por padrão, a API roda na porta **3000**. Para mudar, defina a variável de ambiente:

```bash
PORT=4000 npm run server
```

### CORS
O CORS está habilitado para todas as origens. Em produção, configure para aceitar apenas o domínio do frontend:

```javascript
app.use(cors({
  origin: 'http://seu-dominio.com'
}));
```

## 📝 Notas

- O banco de dados é criado automaticamente na primeira execução
- Dados iniciais (seed) são inseridos automaticamente se o banco estiver vazio
- O arquivo `cupcakes.db` pode ser deletado para resetar o banco

## 🐛 Debug

Para ver logs detalhados, todas as requisições são logadas no console:
```
[2024-11-15T...] GET /api/cupcakes
[2024-11-15T...] POST /api/orders
```

## 🧪 Testando a API

Use ferramentas como **Postman**, **Insomnia** ou **curl**:

```bash
# Testar health check
curl http://localhost:3000/api/health

# Listar cupcakes
curl http://localhost:3000/api/cupcakes

# Criar pedido
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"id":"ORD-123","items":[...],"total":21.78,"address":"...","paymentMethod":"credit"}'
```
