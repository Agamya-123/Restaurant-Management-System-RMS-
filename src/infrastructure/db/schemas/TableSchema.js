import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, default: 'FREE' },   // FREE | RESERVED | OCCUPIED
    branchId: { type: String, default: 'B1' },
    version: { type: Number, default: 0 },
}, { timestamps: true });

export const TableModel = mongoose.model('Table', TableSchema);
