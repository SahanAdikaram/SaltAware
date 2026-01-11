require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recipeController = require('./controllers/recipeController');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/recommend', recipeController.recommendRecipes);
app.get('/api/recipes', recipeController.getAllRecipes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});