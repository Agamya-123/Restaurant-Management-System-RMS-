import { TableStatus } from '../../domain/enums/TableStatus.js';
import { Reservation } from '../../domain/model/Reservation.js';
import { ReservationResponse } from '../../../presentation/api/dto/Dtos.js';

export class ReservationService {
    constructor(tableRepository, reservationRepository) {
        this.tableRepository = tableRepository;
        this.reservationRepository = reservationRepository;
    }

    /**
     * API: GET /branches/{branchId}/tables/search
     */
    async searchTables(branchId, date, time, capacity) {
        const tables = await this.tableRepository.findAllByBranch(branchId);
        return tables.filter(t => t.capacity >= capacity && t.status === TableStatus.FREE);
    }

    /**
     * API: POST /reservations
     */
    async makeReservation(dto) {
        const table = await this.tableRepository.findById(dto.tableId);
        
        if (!table || table.status !== TableStatus.FREE) {
            return new ReservationResponse(null, dto.tableId, 'FAILED', 'Table unavailable');
        }

        // Phase 5: Optimistic Locking
        // The repository updateStatus will return false if version mismatch
        const success = await this.tableRepository.updateStatus(dto.tableId, TableStatus.RESERVED, table.version);
        
        if (!success) {
            return new ReservationResponse(null, dto.tableId, 'CONFLICT', 'Concurrency Failure: Table taken');
        }

        const reservation = new Reservation(
            `RES-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            dto.tableId,
            dto.customerId,
            dto.reservationTime || dto.time || '19:00',
            dto.partySize
        );

        await this.reservationRepository.save(reservation);
        return new ReservationResponse(reservation.id, dto.tableId, 'CONFIRMED', 'Success');
    }

    /**
     * API: PUT /reservations/{id}/cancel
     */
    async cancelReservation(id) {
        const res = await this.reservationRepository.findById(id);
        if (res) {
            await this.tableRepository.updateStatus(res.tableId, TableStatus.FREE, null);
            await this.reservationRepository.delete(id);
            return { success: true };
        }
        return { success: false, message: 'Reservation not found' };
    }
}
