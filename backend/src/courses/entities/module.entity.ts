import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 0 })
  order: number; // Para ordenar os módulos (1, 2, 3...)

  @ManyToOne(() => Course)
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.module, { cascade: true, orphanedRowAction: 'delete' })
  lessons: Lesson[];
}
