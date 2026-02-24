import { TableModel } from '../db/schemas/TableSchema.js';

const SEED_TABLES = [
    { id: 'T1', capacity: 2 },
    { id: 'T2', capacity: 4 },
    { id: 'T3', capacity: 4 },
    { id: 'T4', capacity: 6 },
    { id: 'T5', capacity: 2 },
    { id: 'T6', capacity: 8 },
];

export class MongoTableRepository {
    async seed() {
        const count = await TableModel.countDocuments();
        if (count === 0) {
            await TableModel.insertMany(SEED_TABLES.map(t => ({ ...t, status: 'FREE', branchId: 'B1', version: 0 })));
            console.log('[DB] Tables seeded.');
        }
    }

    async findById(id) {
        return await TableModel.findOne({ id }).lean();
    }

    async findAllByBranch(branchId) {
        return await TableModel.find({ branchId }).lean();
    }

    async updateStatus(id, status, version) {
        const table = await TableModel.findOne({ id });
        if (!table) return false;

        // Optimistic locking
        if (version !== null && table.version !== version) {
            console.error(`[DB] Optimistic lock conflict on Table ${id}`);
            return false;
        }

        table.status = status;
        table.version += 1;
        await table.save();
        return true;
    }

    async createTable(id, capacity, branchId = 'B1') {
        const existing = await TableModel.findOne({ id });
        if (existing) throw new Error(`Table ${id} already exists.`);
        const table = await TableModel.create({ id, capacity, status: 'FREE', branchId, version: 0 });
        return table.toObject();
    }
}
