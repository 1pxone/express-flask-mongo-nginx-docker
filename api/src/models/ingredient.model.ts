import mongoose from 'mongoose';
import { uuid as uuidv4 } from 'uuidv4';

const ingredientSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ''),
    },
    type: {
        type: String,
        enum: ['sauce', 'bun', 'main'],
    },
    name: String,
    proteins: Number,
    fat: Number,
    carbohydrates: Number,
    incompatibleIngredients: [],
    sku: String,
    price: Number,
    image: String,
});

export const IngredientModel = mongoose.model('Ingredient', ingredientSchema);
