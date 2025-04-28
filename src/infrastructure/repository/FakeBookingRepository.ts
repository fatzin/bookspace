import { Booking } from "../../domain/Entity/Booking/Booking";
import { BookingRepository } from "../../domain/Repository/BookingRepository";

export class FakeBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async save(booking: any): Promise<void> {
    this.bookings.push(booking);
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.getId() === id) || null;
  }
}
