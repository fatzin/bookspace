import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PropertyEntity } from "./PropertyEntity";
import { UserEntity } from "./UserEntity";

@Entity("bookings")
export class BookingEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "datetime", name: "start_date" })
  startDate!: Date;

  @Column({ type: "datetime", name: "end_date" })
  endDate!: Date;

  @Column({ name: "guest_count" })
  guestCount!: number;

  @Column({ name: "total_price", type: "decimal" })
  totalPrice!: number;

  @Column()
  status!: "CONFIRMED" | "CANCELED" | "PENDING";

  @ManyToOne(() => PropertyEntity, (property) => property.bookings, {
    nullable: false,
  })
  @JoinColumn({ name: "property_id" })
  property!: PropertyEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "guest_id" })
  guest!: UserEntity;
}
