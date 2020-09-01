import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@Entity()
export class Shopping extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('text')
  title = '';

  @Column('integer')
  amount = undefined;

  @Column('text')
  unit = '';

  @Column('integer')
  bought = undefined;
}
