// src/components/layout/TopBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useMatch, useNavigate } from 'react-router-dom';
//prettier-ignore
import { PiCompassDuotone, PiBellDuotone, PiSunDuotone, PiMoonDuotone, PiSignOutDuotone, PiCaretDownDuotone, PiGearDuotone, PiList } from 'react-icons/pi';
import useAuthStore, { mockLogin } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const TopBar: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const { toggleSidebar } = useUiStore();
    const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    
    // Check if the current route is within a project workspace
    const inProjectWorkspace = useMatch('/project/:projectId/*');

    useEffect(() => {
        if (!isAuthenticated) mockLogin('userLead123');
    }, [isAuthenticated]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            document.documentElement.classList.toggle('dark', newMode);
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    const handleLogout = () => {
        useAuthStore.getState().logout();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
            isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        );

    const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        cn(
            "block w-full text-left px-4 py-3 text-base font-medium rounded-md transition-colors",
            isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-accent'
        );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b" style={{ height: 'var(--header-height)' }}>
            <div className="flex items-center justify-between h-full px-4 sm:px-6 mx-auto">
                {/* Left Side: Logo & Conditional Sidebar Toggle */}
                <div className="flex items-center gap-2">
                    {inProjectWorkspace && (
                        <Button variant="ghost" size="icon" className="lg:inline-flex" onClick={toggleSidebar}>
                            <PiList className="h-5 w-5" />
                        </Button>
                    )}
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground transition-transform hover:scale-105">
                        <PiCompassDuotone className="w-8 h-8 text-primary" />
                        <span className="hidden sm:inline text-gradient-primary">CREST</span>
                    </Link>
                </div>

                {/* Center: Desktop Navigation */}
                <div className="hidden lg:flex items-center justify-center gap-2">
                    <NavLink to="/" end className={navLinkClasses}>Dashboard</NavLink>
                    <NavLink to="/projects" className={navLinkClasses}>Projects</NavLink>
                    <NavLink to="/forms" className={navLinkClasses}>Forms Library</NavLink>
                    <NavLink to="/settings" className={navLinkClasses}>Settings</NavLink>
                </div>

                {/* Right Side: User Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Mobile Menu Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="lg:hidden" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        <PiList className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon" aria-label="Notifications"><PiBellDuotone className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">{isDarkMode ? <PiSunDuotone className="h-5 w-5" /> : <PiMoonDuotone className="h-5 w-5" />}</Button>
                    <div className="w-px h-6 bg-border mx-2"></div>
                    {user && (
                        <div className="relative" ref={userMenuRef}>
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-accent">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=32&font-size=0.40&bold=true&rounded=true`} alt={user.name} className="w-8 h-8" />
                                <div className="hidden sm:flex items-center gap-1">
                                    <span className="text-sm font-medium">{user.name}</span>
                                    <PiCaretDownDuotone className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-60 rounded-lg shadow-lg bg-popover text-popover-foreground border z-50 p-2 animate-fade-in">
                                    <div className="p-2 border-b"><p className="text-sm font-semibold truncate">{user.name}</p><p className="text-xs text-muted-foreground truncate">{user.email}</p></div>
                                    <div className="mt-1 space-y-1">
                                        <button onClick={() => { setIsUserMenuOpen(false); navigate('/settings'); }} className="w-full text-left flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent"><PiGearDuotone className="w-4 h-4 mr-2" /> Settings</button>
                                        <button onClick={handleLogout} className="w-full text-left flex items-center px-2 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"><PiSignOutDuotone className="w-4 h-4 mr-2" /> Sign out</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b shadow-lg z-40">
                    <div className="p-4 space-y-2">
                        <NavLink 
                            to="/" 
                            end 
                            className={mobileNavLinkClasses}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink 
                            to="/projects" 
                            className={mobileNavLinkClasses}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Projects
                        </NavLink>
                        <NavLink 
                            to="/forms" 
                            className={mobileNavLinkClasses}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Forms Library
                        </NavLink>
                        <NavLink 
                            to="/settings" 
                            className={mobileNavLinkClasses}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Settings
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

export default TopBar;