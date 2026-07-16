import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { Module } from './entities/module.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Module)
    private modulesRepository: Repository<Module>,
  ) {}

  async createLesson(moduleId: string, instructorId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
    const module = await this.modulesRepository.findOne({ 
      where: { id: moduleId },
      relations: { course: { instructor: true } } // Busca o módulo -> curso -> instrutor
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado');
    }

    // Validação: Impedir que o Instrutor X adicione aula no Módulo do Curso do Instrutor Y
    if (module.course.instructor.id !== instructorId) {
      throw new ForbiddenException('Você não tem permissão para adicionar aulas neste curso');
    }

    const lesson = this.lessonsRepository.create({
      ...lessonData,
      module,
    });

    return this.lessonsRepository.save(lesson);
  }
}
