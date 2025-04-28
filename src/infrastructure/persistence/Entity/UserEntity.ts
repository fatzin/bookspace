import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("text")
  name!: string;
}
