import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Module } from './module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  videoUrl: string; // YouTube ou Vimeo link

  @Column('text', { nullable: true })
  content: string; // Texto de apoio (Markdown ou HTML)

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Module, (module) => module.lessons)
  module: Module;
}
