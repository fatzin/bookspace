import { User } from "../domain/Entity/User/User";
import { FakeUserRepository } from "../infrastructure/repository/FakeUserRepository";

export class UserService {
  constructor(private userRepository: FakeUserRepository) {}

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
