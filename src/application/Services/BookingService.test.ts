import { Booking } from "../../domain/Entity/Booking/Booking";
import { FakeBookingRepository } from "../../infrastructure/repository/FakeBookingRepository";
import { CreateBookingDto } from "../DTO/CreateBookingDto";
import { BookingService } from "./BookingService";
import { PropertyService } from "./PropertyService";
import { UserService } from "./UserService";

jest.mock("./PropertyService");
jest.mock("./UserService");

describe("BookingService", () => {
  let bookingService: BookingService;
  let fakeBookingRepository: FakeBookingRepository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;
    mockPropertyService = new PropertyService(
      mockPropertyRepository
    ) as jest.Mocked<PropertyService>;
    mockUserService = new UserService(
      mockUserRepository
    ) as jest.Mocked<UserService>;

    fakeBookingRepository = new FakeBookingRepository();
    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService
    );
  });

  it("deve criar uma reserva com sucesso usando repositório fake", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-12-20"),
      endDate: new Date("2023-12-25"),
      guestCount: 2,
    };
    const result = await bookingService.createBooking(bookingDTO);
    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).toBeInstanceOf(Booking);
    expect(savedBooking?.getId()).toBe(result.getId());
  });

  it("deve lançar um erro quando a propriedade não for encontrada", async () => {
    mockPropertyService.findPropertyById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-12-20"),
      endDate: new Date("2023-12-25"),
      guestCount: 2,
    };
    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Propriedade não encontrada."
    );
  });

  it("deve lançar um erro quando o usuário não for encontrado", async () => {
    mockUserService.findUserById.mockResolvedValue(null);

    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-12-20"),
      endDate: new Date("2023-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Usuário não encontrado."
    );
  });

  it("deve lançar um erro ao tentar criar reserva para um período já reservado", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-12-20"),
      endDate: new Date("2023-12-25"),
      guestCount: 2,
    };
    const result = await bookingService.createBooking(bookingDTO);
    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");

    mockProperty.isAvailable.mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(() => {
      throw new Error(
        "A propriedade não está disponível para o período selecionado."
      );
    });

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "A propriedade não está disponível para o período selecionado."
    );
  });

  it("deve cancelar uma reserva existente usando o repositório fake", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-12-20"),
      endDate: new Date("2023-12-25"),
      guestCount: 2,
    };
    const booking = await bookingService.createBooking(bookingDTO);
    const spyFindById = jest.spyOn(fakeBookingRepository, "findById");

    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getStatus()).toBe("CONFIRMED");

    await bookingService.cancelBooking(booking.getId());

    const cancelledBooking = await fakeBookingRepository.findById(
      booking.getId()
    );
    expect(cancelledBooking).toBeInstanceOf(Booking);
    expect(cancelledBooking?.getStatus()).toBe("CANCELED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    expect(spyFindById).toHaveBeenCalledTimes(2);
    spyFindById.mockRestore();
  });
});
