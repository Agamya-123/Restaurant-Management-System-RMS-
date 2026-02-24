import { MenuItemModel } from '../db/schemas/MenuItemSchema.js';
import { MenuManager } from './MenuManager.js';

export class MongoMenuRepository {
    /**
     * Load all menu items from DB. If empty (first boot), seed from MenuManager.
     */
    async findAll() {
        let items = await MenuItemModel.find({}).lean();
        if (items.length === 0) {
            const seed = MenuManager.getSeedMenu();
            await MenuItemModel.insertMany(seed.map(i => ({
                id: i.id, name: i.name, description: i.description,
                price: i.price, category: i.category, image: i.image, isAvailable: true
            })));
            items = await MenuItemModel.find({}).lean();
        }
        return items;
    }

    async create(data) {
        // Auto-increment id
        const last = await MenuItemModel.findOne({}).sort({ id: -1 }).lean();
        const nextId = last ? last.id + 1 : 1;
        const item = await MenuItemModel.create({ ...data, id: nextId });
        return item.toObject();
    }

    async updateAvailability(id, isAvailable) {
        const item = await MenuItemModel.findOneAndUpdate(
            { id: parseInt(id) },
            { isAvailable },
            { new: true }
        ).lean();
        return item;
    }
}
