import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("returns")
export class Return {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  amount!: number;

  @ManyToOne(() => User)
  updateUser!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}