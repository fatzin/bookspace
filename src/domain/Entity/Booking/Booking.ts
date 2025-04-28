import { RefundRuleFactory } from "../../Cancelation/RefundRuleFactory";
import { DateRange } from "../../ValueObjects/DateRange";
import { Property } from "../Property/Property";
import { User } from "../User/User";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;
  private readonly guest: User;
  private status: "CONFIRMED" | "CANCELED" | "PENDING" = "CONFIRMED";
  private totalPrice: number = 0;

  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    guestCount: number
  ) {
    if (!id) {
      throw new Error("O ID é obrigatório");
    }
    if (!property) {
      throw new Error("A propriedade é obrigatória");
    }
    if (!user) {
      throw new Error("O usuário é obrigatório");
    }
    if (!dateRange) {
      throw new Error("O intervalo de datas é obrigatório");
    }
    if (guestCount <= 0) {
      throw new Error("O número de hóspedes deve ser maior que zero");
    }
    property.validateGuestCount(guestCount);
    if (!property.isAvailable(dateRange)) {
      throw new Error(
        "A propriedade não está disponível para o período selecionado."
      );
    }

    this.id = id;
    this.property = property;
    this.user = user;
    this.guest = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    this.status = "CONFIRMED";

    property.addBooking(this);
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.user;
  }

  getGuest(): User {
    return this.guest;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getGuestCount(): number {
    return this.guestCount;
  }

  getStatus(): "CONFIRMED" | "CANCELED" | "PENDING" {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === "CANCELED") {
      throw new Error("A reserva já está cancelada.");
    }

    const checkInDate = this.dateRange.getStartDate();
    const timeDiff = checkInDate.getTime() - currentDate.getTime();
    const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    this.status = "CANCELED";
  }
}
