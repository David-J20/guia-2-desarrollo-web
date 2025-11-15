#!/bin/bash

# 🧪 Test Script para IT Connect Backend API
# Prueba endpoints de registro, login y búsqueda de contactos

echo "==============================================="
echo "🧪 IT CONNECT API TEST SUITE"
echo "==============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost/it-connect/backend/api/index.php"

# Test 1: Registro de usuario
echo -e "${YELLOW}Test 1: Registro de usuario${NC}"
echo "POST $API_URL?action=register"
echo ""

TEST_EMAIL="test_$(date +%s)@itconnect.com"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL?action=register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Test",
    "email": "'"$TEST_EMAIL"'",
    "password": "testpass123",
    "especialidad": "fullstack"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Check if registration was successful
if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Registration successful${NC}"
  USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo "New User ID: $USER_ID"
else
  echo -e "${RED}❌ Registration failed${NC}"
  USER_ID=""
fi

echo ""
echo "==============================================="
echo ""

# Test 2: Login
echo -e "${YELLOW}Test 2: Login con nuevas credenciales${NC}"
echo "POST $API_URL?action=login"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL?action=login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "testpass123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Login successful${NC}"
else
  echo -e "${RED}❌ Login failed${NC}"
fi

echo ""
echo "==============================================="
echo ""

# Test 3: Login fallido
echo -e "${YELLOW}Test 3: Login con contraseña incorrecta (debe fallar)${NC}"
echo "POST $API_URL?action=login"
echo ""

LOGIN_FAIL=$(curl -s -X POST "$API_URL?action=login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "wrongpassword"
  }')

echo "Response: $LOGIN_FAIL"
echo ""

if echo "$LOGIN_FAIL" | grep -q '"success":false'; then
  echo -e "${GREEN}✅ Login rejection works correctly${NC}"
else
  echo -e "${RED}❌ Login should have failed${NC}"
fi

echo ""
echo "==============================================="
echo ""

# Test 4: Check API health
echo -e "${YELLOW}Test 4: Verificar que API responde con JSON válido${NC}"
echo ""

HEALTH_CHECK=$(curl -s -X POST "$API_URL?action=register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Health Check",
    "email": "health@test.com",
    "password": "test",
    "especialidad": "backend"
  }' | head -c 1)

if [ "$HEALTH_CHECK" = "{" ]; then
  echo -e "${GREEN}✅ API returns valid JSON (starts with {)${NC}"
else
  echo -e "${RED}❌ API response is not valid JSON${NC}"
  echo "First character: '$HEALTH_CHECK'"
fi

echo ""
echo "==============================================="
echo "✅ Test suite completed!"
echo "==============================================="
