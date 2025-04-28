import { Repository } from "typeorm";
import { UserEntity } from "../../infrastructure/persistence/Entity/UserEntity";
import { UserMapper } from "../../infrastructure/persistence/Mappers/UserMapper";
import { User } from "../Entity/User/User";
import { UserRepository } from "./UserRepository";

export class TypeOrmUserRepository implements UserRepository {
  private readonly repository: Repository<UserEntity>;
  constructor(repository: Repository<UserEntity>) {
    this.repository = repository;
  }

  async save(user: User): Promise<void> {
    await this.repository.save(UserMapper.toPersistence(user));
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    return userEntity ? UserMapper.toDomain(userEntity) : null;
  }
}
