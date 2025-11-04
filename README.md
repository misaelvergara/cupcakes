# 🧁 Cupcakes Gourmet - Full Stack Application

Aplicação completa de e-commerce de cupcakes com painel administrativo, construída com Angular 17 e Node.js + Express.

## 📱 Demonstração Visual

A aplicação apresenta dois smartphones lado a lado:
- **Smartphone 1 (Esquerda)**: Fluxo do Cliente
- **Smartphone 2 (Direita)**: Painel Administrativo

Ambos sincronizam em tempo real usando Angular Signals!

## 🎯 Funcionalidades

### Cliente (Smartphone 1)
- ✅ Navegar catálogo de cupcakes
- 🛒 Adicionar itens ao carrinho
- 📦 Realizar pedidos com endereço e pagamento
- 📋 Ver histórico de pedidos
- ✔️ Marcar pedidos como recebidos
- ❌ Cancelar pedidos

### Administrador (Smartphone 2)
- 🧁 Gerenciar cupcakes (CRUD completo)
- 📊 Visualizar todos os pedidos
- 📤 Marcar pedidos como enviados
- ❌ Cancelar pedidos
- 🔄 Sincronização em tempo real com o cliente

## 🛠️ Tecnologias

### Frontend
- **Angular 17** (Standalone Components)
- **Angular Signals** (Estado reativo)
- **SCSS** (Estilização)
- **TypeScript**

### Backend
- **Node.js** + **Express.js**
- **SQLite3** (Banco de dados local)
- **CORS** (Cross-Origin Resource Sharing)

## 🚀 Como Rodar o Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar Apenas o Frontend
```bash
npm start
# Abre em http://localhost:4200
```

### 3. Rodar Apenas o Backend
```bash
npm run server
# API disponível em http://localhost:3000
```

### 4. Rodar Frontend + Backend Simultaneamente (Recomendado)
```bash
npm run dev
```

Isso inicia:
- Frontend em `http://localhost:4200`
- Backend em `http://localhost:3000`

## 📂 Estrutura do Projeto

```
cupcakes/
├── src/                          # Frontend Angular
│   ├── app/
│   │   ├── components/
│   │   │   ├── customer/         # Componentes do cliente
│   │   │   │   ├── home-customer/
│   │   │   │   ├── cupcake-list/
│   │   │   │   ├── cupcake-detail/
│   │   │   │   ├── cart/
│   │   │   │   ├── order-confirmation/
│   │   │   │   └── order-list/
│   │   │   ├── admin/            # Componentes do admin
│   │   │   │   ├── home-admin/
│   │   │   │   ├── manage-cupcakes/
│   │   │   │   └── admin-orders/
│   │   │   └── shared/           # Componentes compartilhados
│   │   │       └── header/
│   │   ├── services/             # Serviços Angular
│   │   │   ├── cupcake.service.ts
│   │   │   ├── cart.service.ts
│   │   │   └── order.service.ts
│   │   └── models/               # Interfaces TypeScript
│   │       └── cupcake.model.ts
│   └── ...
│
├── bakery/                       # Backend Node.js
│   ├── server.js                 # Servidor Express
│   ├── database.js               # Configuração SQLite
│   ├── routes/                   # Rotas da API
│   │   ├── cupcakes.js
│   │   └── orders.js
│   ├── cupcakes.db               # Banco SQLite (gerado automaticamente)
│   ├── test-api.sh               # Script de testes
│   └── README.md                 # Documentação da API
│
└── package.json                  # Dependências unificadas
```

## 📡 API Endpoints

Documentação completa em [`bakery/README.md`](bakery/README.md)

### Principais Endpoints

**Cupcakes:**
- `GET /api/cupcakes` - Listar todos
- `POST /api/cupcakes` - Criar novo
- `PUT /api/cupcakes/:id` - Atualizar
- `DELETE /api/cupcakes/:id` - Deletar

**Pedidos:**
- `GET /api/orders` - Listar todos
- `POST /api/orders` - Criar novo
- `PATCH /api/orders/:id/status` - Atualizar status

## 🗄️ Banco de Dados

O projeto usa **SQLite** (sintaxe similar ao MySQL) com 3 tabelas:

1. **cupcakes** - Catálogo de produtos
2. **orders** - Pedidos realizados
3. **order_items** - Itens de cada pedido

O banco é criado automaticamente na primeira execução com dados iniciais (seed).

## 🔄 Sincronização em Tempo Real

A aplicação usa **Angular Signals** para sincronização automática:

```
Cliente faz pedido → Admin vê imediatamente
Admin marca como enviado → Cliente vê status atualizado
Cliente marca como recebido → Admin vê status atualizado
```

## 🎨 Design

- Layout de **dois smartphones** lado a lado
- Gradiente de fundo roxo/rosa
- Barra de navegação estilo Android
- Botão voltar condicional
- Animações suaves
- Interface responsiva

## 📝 Scripts Disponíveis

```bash
npm start              # Frontend em http://localhost:4200
npm run server         # Backend em http://localhost:3000
npm run dev:server     # Backend com auto-reload (nodemon)
npm run dev            # Frontend + Backend simultâneos
npm run build          # Build de produção do Angular
npm test               # Testes unitários
```

## 🧪 Testando a API

Execute o script de testes:
```bash
chmod +x bakery/test-api.sh
./bakery/test-api.sh
```

Ou use curl/Postman/Insomnia para testar os endpoints manualmente.

## 🔧 Configuração

### Porta do Frontend
Configurada em `angular.json` (padrão: 4200)

### Porta do Backend
Configurada em `bakery/server.js` (padrão: 3000)

Para mudar:
```bash
PORT=4000 npm run server
```

## 📄 Licença

Este é um projeto MVP para demonstração.

## 👨‍💻 Desenvolvimento

Projeto gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 17.3.8.

### Comandos Angular

```bash
ng generate component nome      # Criar componente
ng generate service nome         # Criar serviço
ng build                         # Build de produção
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ e muito açúcar! 🧁**
