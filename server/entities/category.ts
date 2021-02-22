import { RadixIconTypes } from 'shared/types/radixIconsTypes';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Config from './config';
import Service from './service';

@Entity()
export default class Category {
  @PrimaryColumn({ nullable: false, type: 'varchar', length: 200 })
  id: string;

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
