import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../../infrastructure/persistence/Entity/UserEntity";
import { User } from "../Entity/User/User";
import { TypeOrmUserRepository } from "./TypeOrmUserRepository";

describe("TypeORMUserRepository", () => {
  let dataSource: DataSource;
  let userRepository: TypeOrmUserRepository;
  let repository: Repository<UserEntity>;
  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [UserEntity],
      dropSchema: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeOrmUserRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar um usuário com sucesso", async () => {
    const user = new User("1", "John Doe");

    await userRepository.save(user);

    const savedUser = await repository.findOne({ where: { id: "1" } });
    expect(savedUser).toBeDefined();
    expect(savedUser?.id).toBe("1");
  });

  it("deve retornar um usuário quando um ID válido for fornecido", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);

    const savedUser = await userRepository.findById("1");
    expect(savedUser).toBeDefined();
    expect(savedUser?.getId()).toBe("1");
    expect(savedUser?.getName()).toBe("John Doe");
  });

  it("deve retornar null quando um ID inválido for fornecido", async () => {
    const savedUser = await userRepository.findById("invalid-id");
    expect(savedUser).toBeNull();
  });
});
