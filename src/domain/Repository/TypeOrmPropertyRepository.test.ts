import { DataSource, Repository } from "typeorm";
import { BookingEntity } from "../../infrastructure/persistence/Entity/BookingEntity";
import { PropertyEntity } from "../../infrastructure/persistence/Entity/PropertyEntity";
import { UserEntity } from "../../infrastructure/persistence/Entity/UserEntity";
import { Property } from "../Entity/Property/Property";
import { TypeOrmPropertyRepository } from "./TypeOrmPropertyRepository";

describe("TypeOrmPropertyRepository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeOrmPropertyRepository;
  let repository: Repository<PropertyEntity>;
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
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeOrmPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const property = new Property("1", "Casa", "Casa de praia", 5, 200);
    await propertyRepository.save(property);

    const savedProperty = await repository.findOne({ where: { id: "1" } });
    expect(savedProperty).toBeDefined();
    expect(savedProperty?.id).toBe("1");
  });

  it("deve retornar uma propriedade com ID válido", async () => {
    const property = new Property(
      "2",
      "Apartamento",
      "Apartamento na cidade",
      3,
      150
    );
    await propertyRepository.save(property);

    const foundProperty = await propertyRepository.findById("2");
    expect(foundProperty).toBeDefined();
    expect(foundProperty?.getId()).toBe("2");
  });

  it("deve retornar null para uma propriedade com ID inválido", async () => {
    const foundProperty = await propertyRepository.findById("999");
    expect(foundProperty).toBeNull();
  });
});
