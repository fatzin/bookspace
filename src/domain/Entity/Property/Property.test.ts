import { DateRange } from "../../ValueObjects/DateRange";
import { Booking } from "../Booking/Booking";
import { User } from "../User/User";
import { Property } from "./Property";

describe("Property Entity", () => {
  it("deve criar uma instância de Property com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa de praia",
      "Uma bela casa na praia",
      5,
      350
    );
    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de praia");
    expect(property.getDescription()).toBe("Uma bela casa na praia");
    expect(property.getMaxGuests()).toBe(5);
    expect(property.getBasePricePerNight()).toBe(350);
  });

  it("deve lançar um erro se o nome for vazio", () => {
    expect(
      () => new Property("1", "", "Uma bela casa na praia", 5, 350)
    ).toThrow("O nome é obrigatório");
  });

  it("deve lançar um erro se a descrição for vazia", () => {
    expect(() => new Property("1", "Casa de praia", "", 5, 350)).toThrow(
      "A descrição é obrigatória"
    );
  });

  it("deve lançar um erro se o número máximo de hospedes for zero ou negativo", () => {
    expect(
      () => new Property("1", "Casa de praia", "Uma bela casa na praia", 0, 350)
    ).toThrow("O número máximo de hóspedes deve ser maior que zero");

    expect(
      () =>
        new Property("1", "Casa de praia", "Uma bela casa na praia", -1, 350)
    ).toThrow("O número máximo de hóspedes deve ser maior que zero");
  });

  it("deve validar o número máximo de hospedes", () => {
    const prop = new Property(
      "1",
      "Casa de campo",
      "Uma bela casa no campo",
      4,
      200
    );
    expect(() => prop.validateGuestCount(6)).toThrow(
      "Número máximo de hóspedes excedido, Máximo permitido: 4"
    );
  });

  it("deve lançar um erro se o preço base por noite for zero ou negativo", () => {
    expect(
      () => new Property("1", "Casa de praia", "Uma bela casa na praia", 5, 0)
    ).toThrow("O preço base por noite deve ser maior que zero");

    expect(
      () =>
        new Property("1", "Casa de praia", "Uma bela casa na praia", 5, -350)
    ).toThrow("O preço base por noite deve ser maior que zero");
  });

  it("não deve aplicar desconto para estadias menores que 7 noites", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-16")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(600);
  });

  it("deve aplicar desconto de 10% para estadias de 7 noites ou mais", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const dateRange = new DateRange(
      new Date("2024-12-10"),
      new Date("2024-12-17")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(630); // 700 - 10% = 630
  });

  it("deve verificar a disponibilidade da propriedade", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const user = new User("1", "Maria Silva");
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );
    const dateRange2 = new DateRange(
      new Date("2024-12-22"),
      new Date("2024-12-27")
    );

    new Booking("1", property, user, dateRange, 2);
    expect(property.isAvailable(dateRange)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
  });

  it("valida bookings sobrepostos e se método addBooking e getBookings está funcionando", () => {
    const property = new Property("1", "Apartamento", "Descrição", 2, 100);
    const user = new User("1", "Maria Silva");
    const dateRange1 = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );
    const dateRange2 = new DateRange(
      new Date("2024-12-22"),
      new Date("2024-12-27")
    );
    const booking1 = new Booking("1", property, user, dateRange1, 1);

    const booking2 = Object.create(Booking.prototype, {
      id: { value: "2" },
      property: { value: property },
      user: { value: user },
      dateRange: { value: dateRange2 },
      guestCount: { value: 1 },
      status: { value: "CONFIRMED", writable: true },
      totalPrice: {
        value: property.calculateTotalPrice(dateRange2),
        writable: true,
      },
    });

    expect(() => property.addBooking(booking2)).toThrow(
      "A propriedade não está disponível para as datas selecionadas."
    );
  });
});
