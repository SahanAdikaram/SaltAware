const fs = require('fs');
const path = require('path');

describe('Server Data Integrity', () => {
  test('recipes.json should exist and contain valid data', () => {
    console.log('--- Starting Data Integrity Test ---');

    // 1. Locate the file
    const recipesPath = path.join(__dirname, '..', 'data', 'recipes.json');
    console.log(`Checking for file at: ${recipesPath}`);

    // 2. Check if file exists
    const exists = fs.existsSync(recipesPath);
    console.log(`File exists: ${exists}`);
    expect(exists).toBe(true);

    // 3. Check if it contains valid JSON
    console.log('Reading and parsing JSON file...');
    const data = fs.readFileSync(recipesPath, 'utf8');
    const recipes = JSON.parse(data);
    
    // 4. Verify we have recipes
    console.log(`Successfully parsed. Found ${recipes.length} recipes.`);
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);

    // 5. Verify the first recipe has required fields
    const firstRecipe = recipes[0];
    console.log('Verifying structure of the first recipe:');
    
    expect(firstRecipe).toHaveProperty('name');
    expect(firstRecipe).toHaveProperty('ingredients');
    expect(firstRecipe).toHaveProperty('sodium');
    
    console.log('✅ Data Integrity Test Passed');
    console.log('------------------------------------');
  });
});
