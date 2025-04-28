import { User } from "../../domain/Entity/User/User";
import { FakeUserRepository } from "../../infrastructure/repository/FakeUserRepository";
import { UserService } from "./UserService";

describe("UserService", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("deve retornar null quando um id inválido for passado", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("deve retornar um usuário quando um id válido for passado", async () => {
    const user = await userService.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
  });

  it("deve salvar um novo usuário com sucesso e buscando novamente", async () => {
    const newUser: User = new User("3", "Test User");

    await userService.saveUser(newUser);
    const savedUser = await userService.findUserById("3");
    expect(savedUser).not.toBeNull();
    expect(savedUser?.getId()).toBe("3");
    expect(savedUser?.getName()).toBe("Test User");
  });
});
