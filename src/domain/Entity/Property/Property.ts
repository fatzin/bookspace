import { DateRange } from "../../ValueObjects/DateRange";
import { Booking } from "../Booking/Booking";

export class Property {
  private readonly id: string;
  private readonly name: string;
  private readonly description: string;
  private readonly maxGuests: number;
  private readonly basePricePerNight: number;
  private readonly DISCOUNT = 0.1;
  private readonly bookings: Booking[] = [];

  constructor(
    id: string,
    name: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number
  ) {
    if (!id) {
      throw new Error("O ID é obrigatório");
    }
    if (!name) {
      throw new Error("O nome é obrigatório");
    }
    if (!description) {
      throw new Error("A descrição é obrigatória");
    }
    if (maxGuests <= 0) {
      throw new Error("O número máximo de hóspedes deve ser maior que zero");
    }
    if (basePricePerNight <= 0) {
      throw new Error("O preço base por noite deve ser maior que zero");
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  validateGuestCount(guestCount: number): void {
    if (guestCount > this.maxGuests) {
      throw new Error(
        `Número máximo de hóspedes excedido, Máximo permitido: ${this.maxGuests}`
      );
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    if (totalNights >= 7) {
      return this.basePricePerNight * totalNights * (1 - this.DISCOUNT);
    }
    return this.basePricePerNight * totalNights;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() == "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange)
    );
  }

  addBooking(booking: Booking): void {
    if (!this.isAvailable(booking.getDateRange())) {
      throw new Error(
        "A propriedade não está disponível para as datas selecionadas."
      );
    }
    this.bookings.push(booking);
  }
}
