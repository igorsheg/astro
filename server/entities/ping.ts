import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from '.';

@Entity()
export default class PingLog {
  @PrimaryGeneratedColumn('uuid')
  public readonly id?: string;

  @Column({ nullable: false })
  latency: number;

  @ManyToOne(() => Service, service => service.ping, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  service: Service;

  @CreateDateColumn()
  public created_at?: Date;
}
