'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { use } from 'react';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor?: {
    username: string;
  };
  modules?: Module[];
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await fetchApi(`/courses/${courseId}`);
        if (data) {
          if (data.modules) {
            data.modules.sort((a: Module, b: Module) => a.order - b.order);
            data.modules.forEach((m: Module) => {
              if (m.lessons) m.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
            });
          }
          setCourse(data);
          if (data.modules && data.modules.length > 0) {
            setOpenModules({ [data.modules[0].id]: true });
          }
        } else {
          setError('Curso não encontrado.');
        }
      } catch (err) {
        console.error('Erro ao buscar curso:', err);
        setError('Erro ao carregar o curso.');
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setEnrolling(true);
    setError('');
    try {
      await fetchApi(`/enrollments/${courseId}`, { method: 'POST' });
      router.push('/dashboard/student');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar matrícula. Você já pode estar matriculado!');
    } finally {
      setEnrolling(false);
    }
  };

  const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <Link href="/" className="text-purple-600 hover:underline">Return to the home page</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Course Header */}
        <div className="h-64 bg-gradient-to-tr from-purple-600 to-blue-600 relative p-10 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-white">
            <div className="text-purple-200 font-semibold mb-2">
              By {course?.instructor?.username || 'Instrutor Desconhecido'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
              {course?.title}
            </h1>
            {totalLessons > 0 && (
              <div className="flex gap-4 text-purple-200 text-sm mt-3">
                <span>📚 {course?.modules?.length} Modules</span>
                <span>🎬 {totalLessons} Lessons</span>
              </div>
            )}
          </div>
        </div>

        {/* Course Body */}
        <div className="flex flex-col md:flex-row p-8 sm:p-10 gap-10">
          <div className="flex-1 min-w-0">
            {/* Description */}
            <h2 className="text-2xl font-bold text-foreground mb-4">About this course</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap mb-10">
              {course?.description}
            </p>

            {/* Modules & Lessons */}
            {course?.modules && course.modules.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-5">Course Content</h2>
                <div className="space-y-3">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                      {/* Module Header - Accordion */}
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                            Module {module.order}
                          </span>
                          <span className="font-bold text-foreground">{module.title}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {module.lessons?.length || 0} Lessons
                          </span>
                          <span className={`text-gray-400 text-xs transition-transform duration-200 ${openModules[module.id] ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </button>

                      {/* Lessons List */}
                      {openModules[module.id] && module.lessons && module.lessons.length > 0 && (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 px-5 py-3 bg-white dark:bg-gray-900"
                            >
                              <span className="text-gray-400 text-sm flex-shrink-0">🔒</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {lesson.order}. {lesson.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner sticky top-24">
              <div className="text-3xl font-extrabold text-foreground mb-6">
                R$ {Number(course?.price).toFixed(2)}
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4 font-medium">{error}</div>
              )}

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed mb-4"
              >
                {enrolling ? 'Processing...' : 'Buy now'}
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Lifetime access to the course materials. 30-day guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
