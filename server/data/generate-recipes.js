const fs = require('fs');

// Recipe templates with realistic data
const recipeTemplates = [
  // Breakfast
  { category: 'breakfast', baseCalories: 200, baseSodium: 150, baseCarbs: 30, baseProtein: 10 },
  // Salads
  { category: 'salad', baseCalories: 150, baseSodium: 100, baseCarbs: 20, baseProtein: 5 },
  // Soups
  { category: 'soup', baseCalories: 180, baseSodium: 250, baseCarbs: 25, baseProtein: 8 },
  // Main dishes - Meat
  { category: 'meat', baseCalories: 350, baseSodium: 200, baseCarbs: 15, baseProtein: 35 },
  // Main dishes - Fish
  { category: 'fish', baseCalories: 280, baseSodium: 180, baseCarbs: 5, baseProtein: 30 },
  // Vegetarian
  { category: 'vegetarian', baseCalories: 300, baseSodium: 120, baseCarbs: 40, baseProtein: 15 },
  // Side dishes
  { category: 'side', baseCalories: 150, baseSodium: 100, baseCarbs: 25, baseProtein: 4 },
  // Desserts
  { category: 'dessert', baseCalories: 250, baseSodium: 80, baseCarbs: 45, baseProtein: 5 },
];

const ingredientLists = {
  breakfast: ['egg', 'milk', 'cheese', 'bread', 'oatmeal', 'yogurt', 'banana', 'berry', 'honey', 'butter'],
  salad: ['lettuce', 'tomato', 'cucumber', 'onion', 'carrot', 'spinach', 'avocado', 'olive oil', 'lemon', 'vinegar'],
  soup: ['chicken', 'broth', 'onion', 'carrot', 'celery', 'garlic', 'potato', 'tomato', 'herbs', 'salt'],
  meat: ['chicken', 'beef', 'pork', 'turkey', 'garlic', 'onion', 'herbs', 'olive oil', 'pepper', 'salt'],
  fish: ['salmon', 'tuna', 'cod', 'tilapia', 'lemon', 'dill', 'garlic', 'olive oil', 'herbs', 'pepper'],
  vegetarian: ['lentils', 'beans', 'rice', 'pasta', 'tomato', 'onion', 'garlic', 'cheese', 'vegetables', 'herbs'],
  side: ['rice', 'potato', 'vegetables', 'quinoa', 'couscous', 'beans', 'corn', 'peas', 'herbs', 'butter'],
  dessert: ['flour', 'sugar', 'butter', 'egg', 'milk', 'vanilla', 'chocolate', 'fruit', 'cream', 'honey'],
};

const recipeNames = {
  breakfast: [
    'Classic Scrambled Eggs', 'Oatmeal with Berries', 'Greek Yogurt Parfait', 'Whole Wheat Pancakes',
    'Avocado Toast', 'Egg White Omelet', 'Breakfast Smoothie Bowl', 'French Toast', 'Breakfast Burrito',
    'Chia Pudding', 'Granola Bowl', 'Breakfast Quiche', 'Breakfast Sandwich', 'Fruit Bowl', 'Protein Smoothie',
    'Breakfast Hash', 'Baked Oatmeal', 'Breakfast Muffins', 'Breakfast Casserole', 'Breakfast Wrap',
  ],
  salad: [
    'Caesar Salad', 'Greek Salad', 'Garden Salad', 'Cobb Salad', 'Waldorf Salad', 'Caprese Salad',
    'Spinach Salad', 'Kale Salad', 'Quinoa Salad', 'Lentil Salad', 'Bean Salad', 'Pasta Salad',
    'Chicken Salad', 'Tuna Salad', 'Fruit Salad', 'Coleslaw', 'Potato Salad', 'Mediterranean Salad',
    'Asian Salad', 'Southwestern Salad',
  ],
  soup: [
    'Chicken Noodle Soup', 'Tomato Soup', 'Vegetable Soup', 'Minestrone', 'Lentil Soup', 'Bean Soup',
    'Broccoli Soup', 'Mushroom Soup', 'Butternut Squash Soup', 'Chicken Tortilla Soup', 'French Onion Soup',
    'Clam Chowder', 'Split Pea Soup', 'Beef Stew', 'Chili', 'Gazpacho', 'Miso Soup', 'Pho',
    'Cream of Mushroom', 'Cream of Broccoli',
  ],
  meat: [
    'Grilled Chicken Breast', 'Roasted Chicken', 'Chicken Stir Fry', 'Beef Stir Fry', 'Beef Steak',
    'Pork Chops', 'Turkey Breast', 'Chicken Curry', 'Beef Curry', 'Chicken Fajitas', 'Beef Tacos',
    'Chicken Parmesan', 'Meatballs', 'Chicken Cacciatore', 'Beef Brisket', 'Pork Tenderloin',
    'Chicken Teriyaki', 'Beef Teriyaki', 'Chicken Marsala', 'Beef Stroganoff', 'Chicken Piccata',
  ],
  fish: [
    'Grilled Salmon', 'Baked Salmon', 'Salmon Teriyaki', 'Tuna Steak', 'Baked Cod', 'Fish Tacos',
    'Lemon Herb Fish', 'Pan-Seared Fish', 'Fish Curry', 'Fish Soup', 'Salmon Patties', 'Tuna Salad',
    'Fish and Chips', 'Cajun Fish', 'Mediterranean Fish', 'Herb-Crusted Fish', 'Fish Stew',
    'Teriyaki Fish', 'Fish Cakes', 'Grilled Tuna',
  ],
  vegetarian: [
    'Vegetable Stir Fry', 'Pasta Primavera', 'Vegetable Curry', 'Lentil Curry', 'Bean Burrito',
    'Vegetarian Tacos', 'Quinoa Bowl', 'Vegetable Lasagna', 'Stuffed Peppers', 'Vegetable Casserole',
    'Mushroom Risotto', 'Vegetable Paella', 'Falafel', 'Hummus', 'Vegetable Soup', 'Vegetable Stew',
    'Ratatouille', 'Vegetable Moussaka', 'Vegetable Pie', 'Stuffed Zucchini',
  ],
  side: [
    'Steamed Vegetables', 'Roasted Vegetables', 'Mashed Potatoes', 'Roasted Potatoes', 'Rice Pilaf',
    'Quinoa Side', 'Couscous', 'Green Beans', 'Corn on the Cob', 'Baked Beans', 'Coleslaw',
    'Potato Salad', 'Macaroni Salad', 'Pasta Side', 'Roasted Root Vegetables', 'Grilled Vegetables',
    'Sauteed Vegetables', 'Vegetable Medley', 'Herbed Rice', 'Wild Rice',
  ],
  dessert: [
    'Chocolate Cake', 'Vanilla Cake', 'Apple Pie', 'Chocolate Chip Cookies', 'Brownies',
    'Cheesecake', 'Tiramisu', 'Fruit Tart', 'Ice Cream', 'Pudding', 'Mousse', 'Custard',
    'Fruit Salad', 'Sorbet', 'Gelato', 'Creme Brulee', 'Chocolate Mousse', 'Fruit Crisp',
    'Bread Pudding', 'Rice Pudding',
  ],
};

function generateRecipe(id, category) {
  const template = recipeTemplates.find(t => t.category === category);
  const names = recipeNames[category];
  const ingredients = ingredientLists[category];
  
  // Random variation
  const variation = () => Math.floor(Math.random() * 40) - 20; // ±20%
  
  const name = names[Math.floor(Math.random() * names.length)];
  const numIngredients = Math.floor(Math.random() * 5) + 4; // 4-8 ingredients
  const selectedIngredients = [];
  
  for (let i = 0; i < numIngredients; i++) {
    const ing = ingredients[Math.floor(Math.random() * ingredients.length)];
    if (!selectedIngredients.find(item => item.name === ing)) {
      selectedIngredients.push({
        name: ing,
        amount: ['1 cup', '1/2 cup', '2 tbsp', '1 tbsp', '1 tsp', '1', '2', '3', '1/4 cup', '1/2'][Math.floor(Math.random() * 10)]
      });
    }
  }
  
  const calories = Math.max(50, template.baseCalories + variation());
  const sodium = Math.max(20, template.baseSodium + variation());
  const carbs = Math.max(5, template.baseCarbs + Math.floor(variation() * 0.5));
  const protein = Math.max(2, template.baseProtein + Math.floor(variation() * 0.3));
  
  const tags = [category];
  if (sodium < 150) tags.push('low-sodium');
  if (carbs < 20) tags.push('low-carb');
  if (protein > 20) tags.push('high-protein');
  if (category === 'vegetarian' || category === 'salad') tags.push('vegetarian');
  
  return {
    id,
    name,
    ingredients: selectedIngredients,
    instructions: `Prepare ${name.toLowerCase()}. Combine ingredients and cook according to recipe. Season to taste and serve.`,
    sodium: Math.round(sodium),
    carbs: Math.round(carbs),
    protein: Math.round(protein),
    calories: Math.round(calories),
    tags
  };
}

// Generate 200 recipes
const recipes = [];
let id = 1;

const categories = ['breakfast', 'salad', 'soup', 'meat', 'fish', 'vegetarian', 'side', 'dessert'];
const recipesPerCategory = Math.floor(200 / categories.length);

categories.forEach(category => {
  for (let i = 0; i < recipesPerCategory; i++) {
    recipes.push(generateRecipe(id++, category));
  }
});

// Fill remaining slots
const remaining = 200 - recipes.length;
for (let i = 0; i < remaining; i++) {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  recipes.push(generateRecipe(id++, randomCategory));
}

// Write to file
fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
console.log(`Generated ${recipes.length} recipes!`);
console.log(`Categories: ${categories.join(', ')}`);

