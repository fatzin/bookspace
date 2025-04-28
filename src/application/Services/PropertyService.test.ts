import { Property } from "../../domain/Entity/Property/Property";
import { PropertyRepository } from "../../domain/Repository/PropertyRepository";
import { FakePropertyRepository } from "../../infrastructure/repository/FakePropertyRepository";
import { PropertyService } from "./PropertyService";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: PropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("deve retornar null quando um ID inválido for passado", async () => {
    const property = await propertyService.findPropertyById("invalid-id");
    expect(property).toBeNull();
  });

  it("deve retornar uma propriedade quando um ID válido for passado", async () => {
    const property = await propertyService.findPropertyById("1");
    expect(property).toBeInstanceOf(Property);
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Casa de Praia");
    expect(property?.getDescription()).toBe(
      "Uma linda casa de praia com vista para o mar."
    );
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const propertyData = new Property(
      "4",
      "Casa de Praia",
      "Uma linda casa de praia com vista para o mar.",
      4,
      200
    );
    await propertyService.createProperty(propertyData);
    const property = await propertyService.findPropertyById("4");
    expect(property).toBeInstanceOf(Property);
    expect(property?.getId()).toBe("4");
    expect(property?.getName()).toBe("Casa de Praia");
    expect(property?.getDescription()).toBe(
      "Uma linda casa de praia com vista para o mar."
    );
    expect(property?.getMaxGuests()).toBe(4);
    expect(property?.getBasePricePerNight()).toBe(200);
  });
});
