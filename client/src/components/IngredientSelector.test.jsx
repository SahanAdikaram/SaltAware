import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IngredientSelector from './IngredientSelector';
import { useRecipeContext } from '../context/RecipeContext';

// 1. MOCK THE CONTEXT
jest.mock('../context/RecipeContext');

describe('IngredientSelector Component', () => {
  // Define mock functions to track if they get called
  const mockAddIngredient = jest.fn();
  const mockRemoveIngredient = jest.fn();

  // 2. SETUP BEFORE EACH TEST
  beforeEach(() => {
    // Reset the mocks so one test doesn't affect another
    mockAddIngredient.mockClear();
    mockRemoveIngredient.mockClear();

    // Default state: Empty pantry
    useRecipeContext.mockReturnValue({
      ingredients: [],
      addIngredient: mockAddIngredient,
      removeIngredient: mockRemoveIngredient,
    });
  });

  test('renders correctly (sanity check)', () => {
    render(<IngredientSelector />);
    
    // Check for main title
    expect(screen.getByText(/Your Pantry/i)).toBeInTheDocument();
    // Check for input field
    expect(screen.getByLabelText(/Add an ingredient/i)).toBeInTheDocument();
  });

  test('allows user to type and add an ingredient via button', () => {
    render(<IngredientSelector />);

    // 1. Find the input
    const input = screen.getByLabelText(/Add an ingredient/i);
    
    // 2. Type "Chicken"
    fireEvent.change(input, { target: { value: 'Chicken' } });
    expect(input.value).toBe('Chicken'); // Verify typing worked

    // 3. Click "Add Ingredient" button
    const addButton = screen.getByRole('button', { name: /Add Ingredient/i });
    fireEvent.click(addButton);

    // 4. Verify context function was called with normalized text ("chicken")
    expect(mockAddIngredient).toHaveBeenCalledTimes(1);
    expect(mockAddIngredient).toHaveBeenCalledWith('chicken');
  });

  test('allows adding ingredient via Enter key', () => {
    render(<IngredientSelector />);

    const input = screen.getByLabelText(/Add an ingredient/i);
    
    fireEvent.change(input, { target: { value: 'Garlic' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockAddIngredient).toHaveBeenCalledWith('garlic');
  });

  test('displays ingredients from context as chips', () => {
    // Override mock to simulate existing ingredients
    useRecipeContext.mockReturnValue({
      ingredients: ['tomato', 'basil'],
      addIngredient: mockAddIngredient,
      removeIngredient: mockRemoveIngredient,
    });

    render(<IngredientSelector />);

    // Check if chips exist
    expect(screen.getByText('tomato')).toBeInTheDocument();
    expect(screen.getByText('basil')).toBeInTheDocument();
  });

  test('calls removeIngredient when chip delete is clicked', () => {
    useRecipeContext.mockReturnValue({
      ingredients: ['tomato'],
      addIngredient: mockAddIngredient,
      removeIngredient: mockRemoveIngredient,
    });

    render(<IngredientSelector />);

    // Find the delete icon/button on the chip
    const deleteIcon = screen.getByTestId('CancelIcon');    
    fireEvent.click(deleteIcon);

    expect(mockRemoveIngredient).toHaveBeenCalledWith('tomato');
  });
});
