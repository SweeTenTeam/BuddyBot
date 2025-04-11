import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('last_update')
export class LastUpdateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'timestamp' })
  lastFetch: Date;
}