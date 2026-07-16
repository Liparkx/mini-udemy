import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Inscreve um aluno em um curso
  async enroll(studentId: string, courseId: string): Promise<Enrollment> {
    const student = await this.usersRepository.findOne({ where: { id: studentId } });
    const course = await this.coursesRepository.findOne({ where: { id: courseId } });

    if (!student) throw new NotFoundException('Aluno não encontrado');
    if (!course) throw new NotFoundException('Curso não encontrado');

    // Verifica se já está matriculado
    const existingEnrollment = await this.enrollmentsRepository.findOne({
      where: {
        student: { id: studentId },
        course: { id: courseId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Você já está matriculado neste curso!');
    }

    const enrollment = this.enrollmentsRepository.create({
      student: student,
      course: course,
    });

    return this.enrollmentsRepository.save(enrollment);
  }

  // Lista todos os cursos que o aluno está matriculado
  async getMyCourses(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { student: { id: studentId } },
      relations: {
        course: {
          instructor: true, // Traz os dados do curso e, dentro dele, do instrutor
        },
      },
    });
  }
}
