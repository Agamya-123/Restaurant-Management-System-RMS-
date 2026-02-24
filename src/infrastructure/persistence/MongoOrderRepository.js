import { OrderModel } from '../db/schemas/OrderSchema.js';

export class MongoOrderRepository {
    async save(order) {
        await OrderModel.create({
            id: order.id,
            tableId: order.tableId,
            waiterId: order.waiterId,
            status: order.status,
            orderItems: order.orderItems,
            totalAmount: order.totalAmount,
        });
    }

    async findById(id) {
        return await OrderModel.findOne({ id }).lean();
    }

    async findAll() {
        return await OrderModel.find({}).lean();
    }

    async update(order) {
        await OrderModel.findOneAndUpdate(
            { id: order.id },
            {
                status: order.status,
                orderItems: order.orderItems,
                totalAmount: order.totalAmount,
                paidAt: order.paidAt,
                paymentMethod: order.paymentMethod,
            },
            { new: true }
        );
    }
}
