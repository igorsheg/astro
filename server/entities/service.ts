import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './category';

export type TargetType = '_blank' | '';

@Entity()
export default class Service {
  @PrimaryGeneratedColumn()
  id?: number;

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

  @ManyToOne(() => Category)
  @JoinColumn({ referencedColumnName: 'id' })
  category: Category;
}
