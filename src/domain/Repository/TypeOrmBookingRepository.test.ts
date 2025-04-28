import { DataSource, Repository } from "typeorm";
import { BookingEntity } from "../../infrastructure/persistence/Entity/BookingEntity";
import { PropertyEntity } from "../../infrastructure/persistence/Entity/PropertyEntity";
import { UserEntity } from "../../infrastructure/persistence/Entity/UserEntity";
import { Booking } from "../Entity/Booking/Booking";
import { Property } from "../Entity/Property/Property";
import { User } from "../Entity/User/User";
import { DateRange } from "../ValueObjects/DateRange";
import { TypeOrmBookingRepository } from "./TypeOrmBookingRepository";

describe("TypeOrmPropertyRepository", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeOrmBookingRepository;
  let repository: Repository<BookingEntity>;
  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [UserEntity, PropertyEntity, BookingEntity],
      dropSchema: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(BookingEntity);
    bookingRepository = new TypeOrmBookingRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar uma reserva com sucesso", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);
    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "Casa de Praia",
      description: "Uma linda casa de praia",
      maxGuests: 10,
      basePricePerNight: 100,
    });
    await propertyRepository.save(propertyEntity);
    const userEntity = userRepository.create({
      id: "1",
      name: "João",
    });
    await userRepository.save(userEntity);

    const user = new User("1", "João");
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia",
      10,
      100
    );
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 2);
    await bookingRepository.save(booking);
    const savedBooking = await bookingRepository.findById("1");
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe("1");
    expect(savedBooking?.getProperty().getId()).toBe("1");
    expect(savedBooking?.getGuest().getId()).toBe("1");
  });

  it("deve retornar null para uma reserva com ID inválido", async () => {
    const foundBooking = await bookingRepository.findById("999");
    expect(foundBooking).toBeNull();
  });

  it("deve salvar uma reserva com sucesso - fazendo cancelamento posterior", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);
    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "Casa de Praia",
      description: "Uma linda casa de praia",
      maxGuests: 10,
      basePricePerNight: 100,
    });
    await propertyRepository.save(propertyEntity);
    const userEntity = userRepository.create({
      id: "1",
      name: "João",
    });
    await userRepository.save(userEntity);

    const user = new User("1", "João");
    const property = new Property(
      "1",
      "Casa de Praia",
      "Uma linda casa de praia",
      10,
      100
    );
    const dateRange = new DateRange(
      new Date("2024-12-20"),
      new Date("2024-12-25")
    );

    const booking = new Booking("1", property, user, dateRange, 2);
    await bookingRepository.save(booking);

    booking.cancel(new Date("2024-12-15"));
    await bookingRepository.save(booking);
    const savedBooking = await bookingRepository.findById("1");
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe("1");
    expect(savedBooking?.getProperty().getId()).toBe("1");
    expect(savedBooking?.getGuest().getId()).toBe("1");
    expect(savedBooking?.getStatus()).toBe("CANCELED");
  });
});
