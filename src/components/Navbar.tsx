import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="h-8 w-8 text-amber-600 group-hover:text-amber-700 transition-colors" />
            <span className="text-xl font-bold text-gray-900">Masomo Bora</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link
                to="/courses"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/courses')
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-amber-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Courses</span>
              </Link>

              <Link
                to="/progress"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/progress')
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-amber-50'
                }`}
              >
                <Award className="h-4 w-4" />
                <span className="font-medium">My Progress</span>
              </Link>

              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
