import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Config from './config';

@Entity()
export default class Theme {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @Column({ nullable: true })
  label: string;

  @Column('simple-json')
  accent!: { primary: string; secondary: string };

  @Column('simple-json')
  background!: { primary: string; secondary: string };

  @Column('simple-json')
  text!: { primary: string; secondary: string };

  @Column('simple-json')
  border!: { primary: string; secondary: string };

  @ManyToOne(() => Config)
  @JoinColumn({ referencedColumnName: 'id' })
  config?: Config;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
