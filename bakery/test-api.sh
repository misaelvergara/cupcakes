#!/bin/bash

# Script de teste da API Bakery

API_URL="http://localhost:3000"

echo "🧁 Testando Bakery API..."
echo ""

# Health Check
echo "1. Health Check:"
curl -s "$API_URL/api/health" | json_pp
echo ""

# Listar Cupcakes
echo "2. Listar Cupcakes:"
curl -s "$API_URL/api/cupcakes" | json_pp
echo ""

# Buscar Cupcake específico
echo "3. Buscar Cupcake ID 1:"
curl -s "$API_URL/api/cupcakes/1" | json_pp
echo ""

# Criar novo Cupcake
echo "4. Criar novo Cupcake:"
curl -s -X POST "$API_URL/api/cupcakes" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cupcake de Chocolate",
    "price": 12.50,
    "image": "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop",
    "description": "Delicioso cupcake de chocolate belga"
  }' | json_pp
echo ""

# Listar Pedidos
echo "5. Listar Pedidos:"
curl -s "$API_URL/api/orders" | json_pp
echo ""

# Criar novo Pedido
echo "6. Criar novo Pedido:"
curl -s -X POST "$API_URL/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ORD-TEST-123",
    "items": [
      {
        "quantity": 2,
        "cupcake": {
          "id": 1,
          "name": "Cupcakke de morango",
          "price": 10.89,
          "image": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop",
          "description": "Delicioso cupcake de morango com cobertura cremosa"
        }
      }
    ],
    "total": 21.78,
    "address": "Rua das Flores, 123",
    "paymentMethod": "credit"
  }' | json_pp
echo ""

# Atualizar Status do Pedido
echo "7. Atualizar Status do Pedido:"
curl -s -X PATCH "$API_URL/api/orders/ORD-TEST-123/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}' | json_pp
echo ""

echo "✅ Testes concluídos!"
