import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BookingEntity } from "./BookingEntity";

@Entity("properties")
export class PropertyEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("text")
  name!: string;

  @Column()
  description!: string;

  @Column("int", { name: "max_guests" })
  maxGuests!: number;

  @Column({ name: "base_price_per_night", type: "decimal" })
  basePricePerNight!: number;

  @OneToMany(() => BookingEntity, (booking) => booking.property)
  bookings!: BookingEntity[];
}
