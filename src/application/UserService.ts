import { User } from "../domain/Entity/User/User";
import { UserRepository } from "./../domain/Repository/UserRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
