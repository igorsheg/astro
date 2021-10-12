import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TargetType } from 'typings';
import Category from './category';
import ServicePing from './ping';

@Entity()
export default class Service {
  @PrimaryGeneratedColumn('uuid')
  public readonly id?: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: false, default: '#' })
  url?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({
    nullable: false,
    type: 'text',
    default: '_blank',
  })
  target?: TargetType;

  @Column({
    type: 'text',
    nullable: false,
    default: 'logoPlaceHolder.png',
  })
  logo?: string;

  @ManyToOne(() => Category, category => category.services, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => ServicePing, ping => ping.service, { eager: true })
  ping?: ServicePing[];
}
