import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum InvestmentType {
  ACCOUNT_ACTIVATION = "account-activation",
  INVESTMENT = "investment",
}

@Entity("investments")
export class Investment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amount!: number;

  @Column({ default: false })
  expired!: boolean;

  @Column({ type: "enum", enum: InvestmentType })
  type!: InvestmentType;

  @Column({ type: "decimal", precision: 10, scale: 4, default: "0.00" })
  amountReturned!: number;

  @Column({ type: "decimal", precision: 10, scale: 4, default: "0.00" })
  availableAmount!: number;

  @ManyToOne( () => User, (user) => user.investments)
  investor!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
