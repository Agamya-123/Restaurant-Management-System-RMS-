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
    orderItems: [OrderItemSchema],   // all items — used for billing (main) or batch items (sub)
    checkedItems: [String],          // mealItem.id strings the chef has ticked off
    isSubOrder: { type: Boolean, default: false }, // true = kitchen-route round, not billed separately
    kitchenBatch: [OrderItemSchema], // legacy — no longer used, kept for zero-risk compat
    totalAmount: { type: Number, default: 0 },
    paidAt: { type: Date },
    paymentMethod: { type: String },
}, { timestamps: true });

export const OrderModel = mongoose.model('Order', OrderSchema);
