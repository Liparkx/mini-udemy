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
  modules?: Module[];
}

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadCourse() {
      try {
        const data = await fetchApi(`/courses/${courseId}`);
        if (data?.modules) {
          data.modules.sort((a: Module, b: Module) => a.order - b.order);
          data.modules.forEach((m: Module) => {
            if (m.lessons) m.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
          });
        }
        setCourse(data);
        // Auto-select the first lesson
        const firstLesson = data?.modules?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      } catch (err) {
        console.error('Erro ao buscar curso:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-gray-50 dark:bg-black">
      {/* Player Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sm:px-8 flex items-center justify-between">
        <Link href="/dashboard/student" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 font-medium flex items-center gap-2 transition-colors">
          ← Return to Dashboard
        </Link>
        <h1 className="font-bold text-foreground truncate mx-4">
          {activeLesson ? activeLesson.title : course?.title}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Main Area - Video Player */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900/50">
          {activeLesson ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-4xl p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-8 text-purple-600 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">{activeLesson.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Click the button below to watch the lesson on the video platform.
              </p>
              <a
                href={activeLesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
              >
                Watch Lesson
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-4xl p-12 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Select a lesson from the menu on the side to get started.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Real Modules & Lessons */}
        <div className="w-full lg:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div className="p-6">
            <h3 className="font-bold text-foreground text-lg mb-4">Course Content</h3>

            {course?.modules && course.modules.length > 0 ? (
              <div className="space-y-5">
                {course.modules.map((module) => (
                  <div key={module.id}>
                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                      Module {module.order}: {module.title}
                    </div>
                    <div className="flex flex-col gap-1">
                      {module.lessons?.map((lesson) => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${isActive
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-4 border-purple-600'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            <span className="text-xs flex-shrink-0">
                              {isActive ? '▶' : '○'}
                            </span>
                            <span className="font-medium text-sm">
                              {lesson.order}. {lesson.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No modules available in this course yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
