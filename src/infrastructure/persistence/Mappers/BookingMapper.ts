import { Booking } from "../../../domain/Entity/Booking/Booking";
import { Property } from "../../../domain/Entity/Property/Property";
import { DateRange } from "../../../domain/ValueObjects/DateRange";
import { BookingEntity } from "../Entity/BookingEntity";
import { PropertyMapper } from "./PropertyMapper";
import { UserMapper } from "./UserMapper";

export class BookingMapper {
  static toDomain(bookingEntity: BookingEntity, property?: Property): Booking {
    const guest = UserMapper.toDomain(bookingEntity.guest);
    const dateRange = new DateRange(
      bookingEntity.startDate,
      bookingEntity.endDate
    );
    const booking = new Booking(
      bookingEntity.id,
      property || PropertyMapper.toEntity(bookingEntity.property),
      guest,
      dateRange,
      bookingEntity.guestCount
    );

    booking["totalPrice"] = Number(bookingEntity.totalPrice);
    booking["status"] = bookingEntity.status;
    return booking;
  }

  static toPersistence(booking: Booking): BookingEntity {
    const bookingEntity = new BookingEntity();
    bookingEntity.id = booking.getId();
    bookingEntity.guest = UserMapper.toPersistence(booking.getGuest());
    bookingEntity.property = PropertyMapper.toPersistence(
      booking.getProperty()
    );
    bookingEntity.startDate = booking.getDateRange().getStartDate();
    bookingEntity.endDate = booking.getDateRange().getEndDate();
    bookingEntity.guestCount = booking.getGuestCount();
    bookingEntity.totalPrice = booking.getTotalPrice();
    bookingEntity.status = booking.getStatus();
    return bookingEntity;
  }
}
