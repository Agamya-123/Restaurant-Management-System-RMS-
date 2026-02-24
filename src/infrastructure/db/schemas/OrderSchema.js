import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    mealItem: {
        id: Number,
        name: String,
        description: String,
        price: Number,
        category: String,
        image: String,
        isAvailable: Boolean,
    },
    quantity: { type: Number, default: 1 },
    priceAtPurchase: Number,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    tableId: { type: String, required: true },
    waiterId: String,
    status: { type: String, default: 'RECEIVED' },  // RECEIVED | PREPARING | READY | SERVED | PAID
    orderItems: [OrderItemSchema],
    totalAmount: { type: Number, default: 0 },
    paidAt: { type: Date },
    paymentMethod: { type: String },
}, { timestamps: true });

export const OrderModel = mongoose.model('Order', OrderSchema);
