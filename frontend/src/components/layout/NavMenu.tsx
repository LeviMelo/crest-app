// src/components/layout/NavMenu.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  path?: string;
  icon?: IconType;
  isHeader?: boolean;
  children?: NavItem[];
  roles?: string[];
}

const NavMenu: React.FC<{ items: NavItem[] }> = ({ items }) => {
  const location = useLocation();

  const isChildActive = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => 
      child.path === location.pathname || (child.children && isChildActive(child))
    );
  };

  return (
    <nav>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            {item.isHeader ? (
              <h3 className={cn("px-3 pt-4 pb-1 text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider", isChildActive(item) && 'text-primary')}>
                {item.label}
              </h3>
            ) : (
              item.path && (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center p-2.5 text-sm rounded-lg hover:bg-accent transition-all duration-200 group relative',
                      isActive 
                        ? 'font-semibold text-primary bg-primary/10 dark:shadow-glow-primary-md' 
                        : 'font-medium text-foreground/80 hover:text-foreground'
                    )
                  }
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3 shrink-0" />}
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              )
            )}
            {item.children && (
              <ul className="pl-4 mt-1 space-y-1 border-l-2 border-border/50 ml-3">
                <NavMenu items={item.children} />
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;