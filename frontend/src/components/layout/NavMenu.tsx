// src/components/layout/NavMenu.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  path?: string;
  icon?: IconType;
  isHeader?: boolean;
  children?: NavItem[];
  roles?: string[]; // <-- FIX: Added optional roles property for permission checking
}

const NavMenu: React.FC<{ items: NavItem[] }> = ({ items }) => {
  return (
    <nav>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            {item.isHeader ? (
              <h3 className="px-3 pt-4 pb-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                {item.label}
              </h3>
            ) : (
              item.path && (
                <NavLink
                  to={item.path}
                  end={item.path === '/' || item.path.includes('/project/')} // 'end' is crucial for parent routes
                  className={({ isActive }) =>
                    cn(
                      'flex items-center p-2 text-foreground rounded-lg hover:bg-accent transition-colors',
                      isActive ? 'bg-accent font-semibold' : 'font-normal'
                    )
                  }
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3 text-muted-foreground" />}
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              )
            )}
            {item.children && (
              <ul className="pl-4 mt-1 space-y-1">
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