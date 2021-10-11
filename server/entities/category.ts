import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RadixIconTypes } from 'typings/radixIconsTypes';
import Service from './service';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn('uuid')
  public readonly id?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: 'CircleIcon' })
  icon: RadixIconTypes;

  @OneToMany(() => Service, service => service.category, {})
  services?: Service[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
