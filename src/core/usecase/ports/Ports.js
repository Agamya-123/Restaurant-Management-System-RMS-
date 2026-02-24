// Incoming Ports (Interfaces for API/UI to call)
export class IReservationUseCase {
    async searchTables(branchId, date, time, capacity) {}
    async makeReservation(reservationDto) {}
    async cancelReservation(id) {}
}

export class IOrderUseCase {
    async createOrder(tableId, waiterId) {}
    async getOrder(id) {}
    async updateOrder(id, updateDto) {}
    async processPayment(orderId, paymentDto) {}
}

// Outgoing Ports (Interfaces for Repositories)
export class IReservationRepository {
    async save(reservation) {}
    async findById(id) {}
    async findAll() {}
    async delete(id) {}
}

export class ITableRepository {
    async findById(id) {}
    async findAllByBranch(branchId) {}
    async updateStatus(id, status, version) {}
}
