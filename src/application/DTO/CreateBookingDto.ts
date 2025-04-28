export interface CreateBookingDto {
  propertyId: string;
  guestId: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
}
