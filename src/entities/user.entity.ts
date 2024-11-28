import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  country!: string;

  @Column()
  city!: string;

  @Column()
  address!: string;

  @Column({ nullable: true })
  lastIpAdress!: string;

  @ManyToOne(() => User, (user) => user.referrers)
  referredBy!: User;

  @OneToMany(() => User, (user) => user.referredBy)
  referrers!: User[];

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  referralCode!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  verificationToken!: string;

  @CreateDateColumn({ default: false })
  verificationTokenExpired!: Date;

  @Column({ default: false })
  isVerified!: boolean;
}
