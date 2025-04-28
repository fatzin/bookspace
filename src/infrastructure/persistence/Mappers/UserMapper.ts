import { User } from "../../../domain/Entity/User/User";
import { UserEntity } from "../Entity/UserEntity";

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    return new User(userEntity.id, userEntity.name);
  }

  static toPersistence(user: User): UserEntity {
    const userEntity = new UserEntity();
    userEntity.id = user.getId();
    userEntity.name = user.getName();
    return userEntity;
  }
}
