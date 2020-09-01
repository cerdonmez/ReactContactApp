import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@Entity()
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('text')
  title = '';

  @Column('text')
  note = '';
}
