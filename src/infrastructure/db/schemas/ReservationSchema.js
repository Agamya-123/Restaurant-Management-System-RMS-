import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    tableId: { type: String, required: true },
    customerId: { type: String, required: true },  // Guest name
    reservationTime: { type: String, required: true },  // HH:MM format
    partySize: { type: Number, default: 2 },
    status: { type: String, default: 'CONFIRMED' },
}, { timestamps: true });

export const ReservationModel = mongoose.model('Reservation', ReservationSchema);
