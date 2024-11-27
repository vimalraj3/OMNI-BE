import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,  } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fisrtName!: string;

  @Column()
  lastName!: string;

  @Column()
  country!: string;

  @Column()
  city!: string;

  @Column()
  address!: string;

  @Column()
  lastIpAdress!: string;

  @ManyToOne(() => User, (user) => user.referrers)
  referredBy!: User;

  @OneToMany(() => User, (user) => user.referredBy)
  referrers!: User[];

  @Column()
  phoneNumber!: string;

  @Column()
  referralCode!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}