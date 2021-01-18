import mongoose from 'mongoose';
import { uuid as uuidv4 } from 'uuidv4';
import { UserModel } from './user.model';
import { IngredientModel } from './ingredient.model';

const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ''),
    },
    name: String,
    ingredients: [IngredientModel],
    owner: UserModel,
    status: String,
    price: Number,
});

export const OrderModel = mongoose.model('Order', orderSchema);
