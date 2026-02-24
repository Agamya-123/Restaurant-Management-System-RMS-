export class InMemoryReservationRepository {
    constructor() {
        this.reservations = new Map();
    }

    async save(reservation) {
        this.reservations.set(reservation.id, reservation);
    }

    async findById(id) {
        return this.reservations.get(id);
    }

    async findAll() {
        return Array.from(this.reservations.values());
    }

    async delete(id) {
        this.reservations.delete(id);
    }
}
