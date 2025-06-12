// src/components/layout/TopBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiCompassDuotone, PiBellDuotone, PiSunDuotone, PiMoonDuotone, PiSignOutDuotone, PiCaretDownDuotone } from 'react-icons/pi';
import useAuthStore, { mockLogout, mockLogin } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      mockLogin('userLead123');
    }
  }, [isAuthenticated]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const handleAuthAction = () => {
    mockLogout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border" style={{ height: 'var(--header-height, 64px)' }}>
      <div className="flex items-center justify-between h-full px-4 sm:px-6 mx-auto">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <PiCompassDuotone className="w-7 h-7 text-primary" />
          <span className="hidden sm:inline">CREST</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <PiBellDuotone className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
            {isDarkMode ? <PiSunDuotone className="h-5 w-5" /> : <PiMoonDuotone className="h-5 w-5" />}
          </Button>

          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full transition-colors hover:bg-accent"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=32&font-size=0.40&bold=true`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-medium">{user.name}</span>
                  <PiCaretDownDuotone className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover text-popover-foreground border border-border z-50">
                   <div className="p-2 border-b border-border">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setIsUserMenuOpen(false); navigate('/settings'); }}
                      className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleAuthAction}
                      className="w-full text-left px-2 py-1.5 text-sm rounded-sm text-destructive hover:bg-destructive/10"
                    >
                      <PiSignOutDuotone className="inline w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;