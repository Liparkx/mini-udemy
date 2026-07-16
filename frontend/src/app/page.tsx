'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    username: string;
  };
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Tenta buscar cursos do backend, se falhar ou estiver vazio, usa mock.
    async function loadCourses() {
      try {
        const data = await fetchApi('/courses');
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(mockCourses);
        }
      } catch (error) {
        console.error('Erro ao buscar cursos, usando mock data:', error);
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      {!isLogged && (
        <section className="text-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl mb-16 shadow-sm border border-purple-100 dark:border-purple-900/30">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-6 tracking-tight">
            Learn what matters.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Accelerate your career with practical courses created by experts.
            Join thousands of students on our platform.
          </p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            Start Now for Free
          </Link>
        </section>
      )}

      {/* Course Catalog */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Courses</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group flex flex-col">
                <div className="h-48 bg-gradient-to-tr from-purple-200 to-blue-200 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center relative overflow-hidden">
                  <span className="dark:text-purple-400/20 font-bold text-6xl group-hover:scale-110 transition-transform duration-500">
                    📚
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    By {course.instructor?.username}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                      R$ {Number(course.price).toFixed(2)}
                    </span>
                    <Link href={`/courses/${course.id}`} className="text-blue-600 dark:text-blue-400 font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      See Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'NestJS e Serverless Avançado',
    description: 'Aprenda a criar APIs escaláveis usando NestJS e faça deploy na AWS usando Serverless Framework.',
    price: 97.00,
    instructor: { username: 'João Silva' }
  },
  {
    id: '2',
    title: 'Next.js 15 e Tailwind v4',
    description: 'Domine a construção de interfaces modernas, responsivas e bonitas com as últimas versões do ecossistema React.',
    price: 147.00,
    instructor: { username: 'Maria Souza' }
  },
  {
    id: '3',
    title: 'Arquitetura de Microserviços',
    description: 'Desacople seu monolito usando padrões arquiteturais e comunicação assíncrona com RabbitMQ.',
    price: 197.00,
    instructor: { username: 'Carlos Santos' }
  }
];
