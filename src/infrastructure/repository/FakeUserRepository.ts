import { User } from "../../domain/Entity/User/User";
import { UserRepository } from "../../domain/Repository/UserRepository";

export class FakeUserRepository implements UserRepository {
  private users: User[] = [
    new User("1", "John Doe"),
    new User("2", "Jane Smith"),
  ];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.getId() === id);
    return user ? Promise.resolve(user) : Promise.resolve(null);
  }

  async save(user: User): Promise<void> {
    const existingUserIndex = this.users.findIndex(
      (u) => u.getId() === user.getId()
    );
    if (existingUserIndex !== -1) {
      this.users[existingUserIndex] = user;
    } else {
      this.users.push(user);
    }
  }
}
