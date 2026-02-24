import { ReservationModel } from '../db/schemas/ReservationSchema.js';

export class MongoReservationRepository {
    async save(reservation) {
        await ReservationModel.create({
            id: reservation.id,
            tableId: reservation.tableId,
            customerId: reservation.customerId,
            reservationTime: reservation.reservationTime,
            partySize: reservation.partySize,
            status: reservation.status,
        });
    }

    async findById(id) {
        return await ReservationModel.findOne({ id }).lean();
    }

    async findAll() {
        return await ReservationModel.find({}).lean();
    }

    async delete(id) {
        await ReservationModel.deleteOne({ id });
    }
}
