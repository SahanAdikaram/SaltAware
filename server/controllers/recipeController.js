const axios = require('axios');

const FDC_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const NUTRIENT_IDS = {
  sodium: 1093,
  carbs: 1005,
  protein: 1003,
  calories: 1008
};

const ensureApiKey = () => {
  const apiKey = process.env.FDC_API_KEY;
  if (!apiKey) {
    const error = new Error('FoodData Central API key is not configured on the server.');
    error.status = 500;
    throw error;
  }
  return apiKey;
};

const fetchFoods = async (body) => {
  const apiKey = ensureApiKey();

  try {
    const response = await axios.post(
      `${FDC_BASE_URL}/foods/search`,
      body,
      {
        params: { api_key: apiKey },
        timeout: 10000
      }
    );

    return response.data?.foods || [];
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Failed to retrieve data from FoodData Central.';
    const wrappedError = new Error(message);
    wrappedError.status = status;
    throw wrappedError;
  }
};

const getNutrientValue = (food, nutrientId) => {
  if (!food?.foodNutrients) return null;
  const nutrient = food.foodNutrients.find(n => n?.nutrient?.id === nutrientId || n?.nutrientId === nutrientId);
  if (!nutrient) return null;
  if (typeof nutrient.amount === 'number') return nutrient.amount;
  if (nutrient?.value) return Number(nutrient.value);
  return null;
};

const parseIngredients = (ingredientsString) => {
  if (!ingredientsString || typeof ingredientsString !== 'string') {
    return [];
  }

  return ingredientsString
    .split(/;|,|\r?\n/)
    .map(item => item.trim())
    .filter(Boolean)
    .map(name => ({ name }));
};

const calculateIngredientScore = (userIngredients, candidateIngredients, description = '') => {
  if (!Array.isArray(userIngredients) || userIngredients.length === 0) {
    return 0;
  }

  const allCandidateStrings = [
    ...candidateIngredients.map(i => i.name.toLowerCase()),
    description.toLowerCase()
  ].filter(Boolean);

  if (allCandidateStrings.length === 0) {
    return 0;
  }

  let matchCount = 0;
  userIngredients.forEach(ing => {
    const normalized = (ing || '').toLowerCase();
    if (!normalized) return;

    const isMatch = allCandidateStrings.some(candidate => candidate.includes(normalized));
    if (isMatch) {
      matchCount += 1;
    }
  });

  const denominator = Math.max(allCandidateStrings.length, userIngredients.length);
  return Math.min(matchCount / denominator, 1);
};

const mapFoodToRecipe = (food, options = {}) => {
  const {
    ingredientsInput = [],
    dailySodiumMax = 1500,
    hasDiabetes = false
  } = options;

  const parsedIngredients = parseIngredients(food?.ingredients);
  const ingredientList = parsedIngredients.length > 0
    ? parsedIngredients
    : (food?.description ? [{ name: food.description }] : []);
  const sodium = getNutrientValue(food, NUTRIENT_IDS.sodium) ?? 0;
  const carbs = getNutrientValue(food, NUTRIENT_IDS.carbs) ?? 0;
  const protein = getNutrientValue(food, NUTRIENT_IDS.protein) ?? 0;
  const calories = getNutrientValue(food, NUTRIENT_IDS.calories) ?? 0;

  const ingredientScore = calculateIngredientScore(ingredientsInput, ingredientList, food?.description);

  let healthScore = dailySodiumMax > 0 ? 1 - (sodium / dailySodiumMax) : 0;
  if (healthScore < 0) healthScore = 0;

  if (hasDiabetes && carbs > 30) {
    healthScore *= 0.7;
  }

  const finalScore = (0.7 * healthScore) + (0.3 * ingredientScore);

  const tags = [];
  if (food?.foodCategory) tags.push(food.foodCategory);
  if (food?.brandOwner) tags.push(food.brandOwner);
  if (food?.dataType) tags.push(food.dataType);

  const instructions = parsedIngredients.length > 0
    ? `This item includes the following ingredients: ${parsedIngredients.map(i => i.name).join(', ')}`
    : `No preparation instructions provided by FoodData Central. Item description: ${food?.description || 'Not available.'}`;

  return {
    id: food?.fdcId,
    name: food?.description || 'Unknown Food',
    ingredients: ingredientList,
    instructions,
    sodium: Math.round(sodium),
    carbs: Math.round(carbs),
    protein: Math.round(protein),
    calories: Math.round(calories),
    tags: tags.filter(Boolean),
    matchScore: Math.round(ingredientScore * 100),
    healthScore: Math.round(healthScore * 100),
    finalScore: Math.round(finalScore * 100),
    source: 'FoodData Central'
  };
};

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      const {
        q: query = 'low sodium meal',
        pageSize = 20,
        dataType
      } = req.query;

      const body = {
        query,
        pageSize: Math.min(Number(pageSize) || 20, 50),
        sortBy: 'score',
        sortOrder: 'desc',
        requireAllWords: false
      };

      if (dataType) {
        body.dataType = Array.isArray(dataType) ? dataType : [dataType];
      }

      const foods = await fetchFoods(body);
      const dailySodiumMax = Number(req.query.dailySodiumMax) || 2000;

      const mapped = foods
        .map(food => mapFoodToRecipe(food, { dailySodiumMax }))
        .filter(recipe => recipe.sodium <= dailySodiumMax)
        .slice(0, body.pageSize);

      res.json(mapped);
    } catch (error) {
      console.error('Error fetching recipes from FoodData Central:', error);
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch recipes.' });
    }
  },
  
  recommendRecipes: async (req, res) => {
    console.log('Received request body:', req.body);

    const { ingredients, healthProfile } = req.body || {};

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient.' });
    }

    if (!healthProfile) {
      return res.status(400).json({ error: 'Missing health profile.' });
    }

    const dailySodiumMax = Number(healthProfile.dailySodiumMax) || 1500;
    const hasDiabetes = Boolean(healthProfile.hasDiabetes);

    try {
      const query = ingredients.join(' ');
      const foods = await fetchFoods({
        query,
        pageSize: 30,
        sortBy: 'score',
        sortOrder: 'desc',
        requireAllWords: false,
        dataType: ['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded']
      });

      const recommendations = foods
        .map(food => mapFoodToRecipe(food, { ingredientsInput: ingredients, dailySodiumMax, hasDiabetes }))
        .filter(recipe => recipe.sodium <= dailySodiumMax)
        .sort((a, b) => b.finalScore - a.finalScore);

      console.log(`Returning ${recommendations.length} recommendations from FoodData Central.`);

      res.json(recommendations);
    } catch (error) {
      console.error('Recommendation error:', error);
      res.status(error.status || 500).json({ error: error.message || 'Failed to fetch recommendations.' });
    }
  }
};