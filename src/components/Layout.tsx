import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, Library, Calendar, HelpCircle, FileText, BarChart2, GitBranch } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students', path: '/students', icon: <Users className="w-5 h-5" /> },
  { label: 'Materials Library', path: '/material-library', icon: <Library className="w-5 h-5" /> },
  { label: 'Seasonal Resources', path: '/seasonal', icon: <FileText className="w-5 h-5" /> },
  { label: 'Scope & Sequence', path: '/scope-sequence', icon: <GitBranch className="w-5 h-5" /> },
  { label: 'Data Reports', path: '/reports', icon: <BarChart2 className="w-5 h-5" /> },
  { label: 'Calendar', path: '/calendar', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Help', path: '/help', icon: <HelpCircle className="w-5 h-5" /> },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-900">School World</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex-1">
            {/* Add search or other header content */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Add user profile, notifications, etc. */}
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}