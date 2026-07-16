'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { use } from 'react';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadCourse() {
      try {
        const data = await fetchApi(`/courses/${courseId}`);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(String(data.price));
        if (data.modules) {
          // Sort modules and lessons by order
          const sortedModules = data.modules.sort((a: any, b: any) => a.order - b.order);
          sortedModules.forEach((m: any) => {
            if (m.lessons) {
              m.lessons.sort((a: any, b: any) => a.order - b.order);
            } else {
              m.lessons = [];
            }
          });
          setModules(sortedModules);
        }
      } catch (err) {
        setError('Unable to load the course.');
      } finally {
        setFetching(false);
      }
    }

    loadCourse();
  }, [courseId, router]);

  const handleAddModule = () => {
    setModules([
      ...modules,
      { id: 'new-' + Date.now().toString(), title: '', lessons: [] }
    ]);
  };

  const handleRemoveModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleModuleTitleChange = (moduleId: string, newTitle: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
  };

  const handleAddLesson = (moduleId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, { id: 'new-' + Date.now().toString(), title: '', videoUrl: '' }]
        };
      }
      return m;
    }));
  };

  const handleRemoveLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId)
        };
      }
      return m;
    }));
  };

  const handleLessonChange = (moduleId: string, lessonId: string, field: keyof Lesson, value: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
        };
      }
      return m;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payloadModules = modules.map((m, mIndex) => {
        const modPayload: any = {
          title: m.title,
          order: mIndex + 1,
          lessons: m.lessons.map((l, lIndex) => {
            const lesPayload: any = {
              title: l.title,
              videoUrl: l.videoUrl,
              order: lIndex + 1
            };
            if (!l.id.includes('new-')) lesPayload.id = l.id;
            return lesPayload;
          })
        };
        if (!m.id.includes('new-')) modPayload.id = m.id;
        return modPayload;
      });

      await fetchApi(`/courses/${courseId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          modules: payloadModules
        }),
      });
      router.push('/dashboard/instructor');
    } catch (err: any) {
      setError(err.message || 'Error updating the course.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Edit Course</h1>
        <p className="text-gray-500 dark:text-gray-400">Update your course information and modify the lessons.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
              Course Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
              Detailed Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2" htmlFor="price">
              Price (R$)
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">R$</span>
              <input
                id="price"
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all text-lg"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Course Content</h2>
              <button
                type="button"
                onClick={handleAddModule}
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold py-2 px-4 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
              >
                + Add Module
              </button>
            </div>

            {modules.length === 0 && (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No modules added yet. Start structuring your course!</p>
              </div>
            )}

            <div className="space-y-6">
              {modules.map((module, mIndex) => (
                <div key={module.id} className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Module {mIndex + 1}</label>
                      <input
                        type="text"
                        required
                        value={module.title}
                        onChange={(e) => handleModuleTitleChange(module.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-semibold"
                        placeholder="Nome do Módulo (ex: Introdução)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(module.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 mt-6 font-semibold"
                    >
                      Remove Module
                    </button>
                  </div>

                  <div className="pl-4 sm:pl-8 border-l-2 border-purple-200 dark:border-purple-900/50 space-y-4">
                    {module.lessons.map((lesson, lIndex) => (
                      <div key={lesson.id} className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 relative group">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Lesson {lIndex + 1} - Title</label>
                          <input
                            type="text"
                            required
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(module.id, lesson.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Título da Aula"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Video URL</label>
                          <input
                            type="url"
                            required
                            value={lesson.videoUrl}
                            onChange={(e) => handleLessonChange(module.id, lesson.id, 'videoUrl', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://youtube.com/..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(module.id, lesson.id)}
                          className="absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title=""
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddLesson(module.id)}
                      className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      + Add Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
