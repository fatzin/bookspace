import { v4 as uuidv4 } from "uuid";
import { Booking } from "../../domain/Entity/Booking/Booking";
import { BookingRepository } from "../../domain/Repository/BookingRepository";
import { DateRange } from "../../domain/ValueObjects/DateRange";
import { CreateBookingDto } from "../DTO/CreateBookingDto";
import { PropertyService } from "./PropertyService";
import { UserService } from "./UserService";
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private propertyService: PropertyService,
    private userService: UserService
  ) {}

  async findBookingById(id: string): Promise<Booking | null> {
    if (!id) {
      return null;
    }
    return await this.bookingRepository.findById(id);
  }

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const property = await this.propertyService.findPropertyById(
      dto.propertyId
    );
    if (!property) {
      throw new Error("Propriedade não encontrada.");
    }

    const user = await this.userService.findUserById(dto.guestId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const dateRage = new DateRange(dto.startDate, dto.endDate); // altamente acoplado, preicsa de mock
    const booking = new Booking(
      uuidv4(),
      property,
      user,
      dateRage,
      dto.guestCount
    );
    await this.bookingRepository.save(booking);
    return booking;
  }

  async cancelBooking(id: string): Promise<void> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error("Reserva não encontrada.");
    }

    booking.cancel(new Date());
    await this.bookingRepository.save(booking);
  }
}
