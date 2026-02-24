import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export const MenuItemModel = mongoose.model('MenuItem', MenuItemSchema);
