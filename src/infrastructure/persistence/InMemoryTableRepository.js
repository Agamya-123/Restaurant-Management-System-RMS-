import { TableStatus } from '../../core/domain/enums/TableStatus.js';
import { Table } from '../../core/domain/model/Table.js';

export class InMemoryTableRepository {
    constructor() {
        // Initialize with seed data for Branch B1
        this.tables = [
            new Table('T1', 2, TableStatus.FREE),
            new Table('T2', 4, TableStatus.FREE),
            new Table('T3', 4, TableStatus.FREE),
            new Table('T4', 6, TableStatus.FREE),
            new Table('T5', 2, TableStatus.FREE),
            new Table('T6', 8, TableStatus.FREE),
        ];
        this.tables.forEach(t => t.branchId = 'B1');
    }

    async findById(id) {
        return this.tables.find(t => t.id === id);
    }

    async findAllByBranch(branchId) {
        return this.tables.filter(t => t.branchId === branchId);
    }

    async updateStatus(id, status, version) {
        const table = this.tables.find(t => t.id === id);
        if (!table) return false;

        // Phase 5: Optimistic Locking
        if (version !== null && table.version !== version) {
            console.error(`Concurrency Conflict on Table ${id}: Expected ${version}, Got ${table.version}`);
            return false;
        }

        table.status = status;
        table.version++;
        return true;
    }
}
