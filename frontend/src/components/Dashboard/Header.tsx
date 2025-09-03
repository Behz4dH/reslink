import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onNewReslink: () => void;
}

export const Header = ({ onNewReslink }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug: Log user data
  console.log('Header component user:', user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'superuser' ? 'bg-purple-600' : 'bg-blue-600';
  };

  return (
    <div className="fixed top-0 right-0 left-60 h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-40">
      <h1 className="text-2xl font-bold text-gray-900">CREATE A RESLINK</h1>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onNewReslink}
          className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-lime-500"
        >
          + New Reslink
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user?.username}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <div 
              className={`w-8 h-8 ${getRoleColor(user?.role || '')} rounded-full text-white flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Click to open user menu"
            >
              {getUserInitials(user?.username || '')}
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};