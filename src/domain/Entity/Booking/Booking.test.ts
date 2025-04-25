import { DateRange } from "../../ValueObjects/DateRange";
import { Property } from "../Property/Property";
import { User } from "../User/User";
import { Booking } from "./Booking";

describe("Booking Entity", () => {
  it("deve criar uma instância de Booking com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toEqual(dateRange);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("deve lançar um erro se o número de hospedes for zero ou negativo", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );

    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );

    expect(() => new Booking("1", property, user, dateRange, 0)).toThrow(
      "O número de hóspedes deve ser maior que zero"
    );
    expect(() => new Booking("1", property, user, dateRange, -1)).toThrow(
      "O número de hóspedes deve ser maior que zero"
    );
  });

  it("deve lançar um erro se o número de hospedes acima do máximo permitido", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );

    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );

    expect(() => new Booking("1", property, user, dateRange, 5)).toThrow(
      "Número máximo de hóspedes excedido, Máximo permitido: 4"
    );
  });

  it("deve calcular o preço total com desconto", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-27")
    );

    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getTotalPrice()).toBe(200 * 7 * 0.9); // 1400 - 10% = 1260
  });

  it("não deve realizar o agendamento, quando uma propriedade não estiver disponível", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-27")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    const dateRange2 = new DateRange(
      new Date("2023-12-15"),
      new Date("2023-12-23")
    );
    expect(() => {
      new Booking("2", property, user, dateRange2, 2);
    }).toThrow("A propriedade não está disponível para o período selecionado.");
  });

  it("deve cancelar uma reserva sem reembolso quando faltam menos de 1 dia para o check-in", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getStatus()).toBe("CONFIRMED");
    const currentDate = new Date("2024-12-19");
    booking.cancel(currentDate);
    expect(booking.getStatus()).toBe("CANCELED");
    expect(booking.getTotalPrice()).toBe(200 * 5);
  });

  it("deve cancelar uma reserva com reembolso total quando a data for superior a 7 dias antes do check-in", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getStatus()).toBe("CONFIRMED");
    const currentDate = new Date("2023-12-10");
    booking.cancel(currentDate);
    expect(booking.getStatus()).toBe("CANCELED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("deve cancelar uma reserva com reembolso parcial quando a data estiver entre 1 e 7 dias antes do check-in", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getStatus()).toBe("CONFIRMED");
    const currentDate = new Date("2023-12-15");
    booking.cancel(currentDate);
    expect(booking.getStatus()).toBe("CANCELED");
    expect(booking.getTotalPrice()).toBe(200 * 5 * 0.5);
  });

  it("não deve cancelar uma reserva já cancelada", () => {
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    const user = new User("1", "João Silva");
    const dateRange = new DateRange(
      new Date("2023-12-20"),
      new Date("2023-12-25")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    expect(booking.getStatus()).toBe("CONFIRMED");
    const currentDate = new Date("2023-12-15");
    booking.cancel(currentDate);
    expect(() => booking.cancel(currentDate)).toThrow(
      "A reserva já está cancelada."
    );
  });
});
