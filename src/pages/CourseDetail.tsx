import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, User, BookOpen, Award } from 'lucide-react';
import { supabase, Course, Lesson, UserProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (progressError) throw progressError;
        setProgress(progressData);
      }

      setCourse(courseData);
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async () => {
    if (!user || !courseId) return;

    setUpdating(true);
    try {
      if (progress) {
        const newCompletedStatus = !progress.completed;
        const { error } = await supabase
          .from('user_progress')
          .update({
            completed: newCompletedStatus,
            completed_at: newCompletedStatus ? new Date().toISOString() : null,
          })
          .eq('id', progress.id);

        if (error) throw error;

        setProgress({
          ...progress,
          completed: newCompletedStatus,
          completed_at: newCompletedStatus ? new Date().toISOString() : null,
        });
      } else {
        const { data, error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Inapakia kozi...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Kozi haijpatikana.</p>
          <Link to="/courses" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Rudi kwa kozi
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.completed || false;

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="relative h-96 overflow-hidden">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Rudi kwa Kozi</span>
            </Link>

            {isCompleted && (
              <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full mb-4">
                <Award className="h-5 w-5" />
                <span className="font-medium">Kozi Imekamilika!</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>

            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{lessons.length} Lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kuhusu Kozi Hii</h2>
              <p className="text-gray-700 leading-relaxed">{course.full_description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Yaliyomo</h2>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{lesson.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maendeleo</h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Hali</span>
                  <span className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {isCompleted ? 'Imekamilika' : 'Haijakamilika'}
                  </span>
                </div>

                {isCompleted && progress?.completed_at && (
                  <p className="text-xs text-gray-500">
                    Imekamilika tarehe {new Date(progress.completed_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              <button
                onClick={toggleCompletion}
                disabled={updating}
                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 shadow-md ${
                  isCompleted
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{updating ? 'Inasasisha...' : 'Weka Haijacomplete'}</span>
                  </>
                ) : (
                  <>
                    <Circle className="h-5 w-5" />
                    <span>{updating ? 'Inasasisha...' : 'Weka Umekamilisha'}</span>
                  </>
                )}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Maelezo ya Kozi</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Masomo</span>
                    <span className="font-medium text-gray-900">{lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mwalimu</span>
                    <span className="font-medium text-gray-900">{course.instructor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
