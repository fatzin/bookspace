import { Repository } from "typeorm";
import { BookingEntity } from "../../infrastructure/persistence/Entity/BookingEntity";
import { BookingMapper } from "../../infrastructure/persistence/Mappers/BookingMapper";
import { Booking } from "../Entity/Booking/Booking";
import { BookingRepository } from "./BookingRepository";

export class TypeOrmBookingRepository implements BookingRepository {
  private readonly repository: Repository<BookingEntity>;
  constructor(repository: Repository<BookingEntity>) {
    this.repository = repository;
  }

  async save(booking: Booking): Promise<void> {
    const bookingEntity = BookingMapper.toPersistence(booking);
    await this.repository.save(bookingEntity);
  }

  async findById(id: string): Promise<Booking | null> {
    const bookingEntity = await this.repository.findOne({
      where: { id },
      relations: ["property", "guest"],
    });
    return bookingEntity ? BookingMapper.toDomain(bookingEntity) : null;
  }
}
