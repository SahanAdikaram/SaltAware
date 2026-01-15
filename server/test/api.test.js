const request = require('supertest');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const recipeController = require('../controllers/recipeController');

// 1. MOCK AXIOS
jest.mock('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/recipes', recipeController.getAllRecipes);
app.post('/api/recommend', recipeController.recommendRecipes);

describe('API Endpoints', () => {
  
  beforeAll(() => {
    process.env.FDC_API_KEY = 'TEST_FAKE_KEY_123'; 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- VALID SCENARIOS (Success) ---

  test('GET /api/recipes returns 200 and a list', async () => {
    console.log('\n--- Test: GET /api/recipes (Valid) ---');

    // Setup Mock
    const mockData = {
      data: {
        foods: [
          { fdcId: 111, description: 'Test Tomato', foodNutrients: [], ingredients: 'tomato' }
        ]
      }
    };
    axios.post.mockResolvedValue(mockData);
    console.log('1. Mocked external API response successfully.');

    // Make Request
    console.log('2. Sending GET request to /api/recipes...');
    const res = await request(app).get('/api/recipes');
    
    // Check Response
    console.log(`3. Received Response: Status ${res.statusCode}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    console.log(`4. Body contains ${res.body.length} items.`);
    
    console.log('✅ GET Test Passed');
  });

  test('POST /api/recommend returns 200 for valid input', async () => {
    console.log('\n--- Test: POST /api/recommend (Valid) ---');

    // Setup Mock
    axios.post.mockResolvedValue({
      data: {
        foods: [
          { fdcId: 222, description: 'Low Salt Chicken', foodNutrients: [], ingredients: 'chicken' }
        ]
      }
    });

    const payload = {
      ingredients: ['chicken'],
      healthProfile: { hypertension: true }
    };
    console.log('1. Sending Payload:', JSON.stringify(payload));

    const res = await request(app)
      .post('/api/recommend')
      .send(payload);

    console.log(`2. Received Response: Status ${res.statusCode}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    
    console.log('✅ POST Valid Test Passed');
  });

  // --- INVALID SCENARIOS (Error 400) ---

  test('POST /api/recommend returns 400 when ingredients are missing', async () => {
    console.log('\n--- Test: POST /api/recommend (Invalid: No Ingredients) ---');
    
    const payload = { healthProfile: { hypertension: true } };
    console.log('1. Sending Invalid Payload:', JSON.stringify(payload));

    const res = await request(app)
      .post('/api/recommend')
      .send(payload);

    console.log(`2. Received Status: ${res.statusCode} (Expected 400)`);
    console.log(`3. Error Message: "${res.body.error}"`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toMatch(/provide at least one ingredient/i);
    
    console.log('✅ POST Invalid Ingredients Test Passed');
  });

  test('POST /api/recommend returns 400 when healthProfile is missing', async () => {
    console.log('\n--- Test: POST /api/recommend (Invalid: No Health Profile) ---');

    const payload = { ingredients: ['tomato'] };
    console.log('1. Sending Invalid Payload:', JSON.stringify(payload));

    const res = await request(app)
      .post('/api/recommend')
      .send(payload);

    console.log(`2. Received Status: ${res.statusCode} (Expected 400)`);
    console.log(`3. Error Message: "${res.body.error}"`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toMatch(/missing health profile/i);
    
    console.log('✅ POST Invalid Profile Test Passed');
  });
});
