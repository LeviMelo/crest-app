import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: IconType;
}

interface NavMenuProps {
  items: NavItem[];
}

const NavMenu: React.FC<NavMenuProps> = ({ items }) => {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center p-2 text-foreground rounded-lg hover:bg-accent',
                isActive ? 'bg-accent font-semibold' : 'font-normal'
              )
            }
          >
            {item.icon && <item.icon className="w-5 h-5 mr-3 text-muted-foreground" />}
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;