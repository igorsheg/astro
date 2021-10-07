import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RadixIconTypes } from 'typings/radixIconsTypes';
import Config from './config';
import Service from './service';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: 'CircleIcon' })
  icon: RadixIconTypes;

  @OneToMany(() => Service, service => service.category, { eager: true })
  services?: Service[];

  @ManyToOne(() => Config)
  @JoinColumn({ referencedColumnName: 'id' })
  config: Config;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
